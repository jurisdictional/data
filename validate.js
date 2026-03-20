#!/usr/bin/env node

const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { globSync } = require("glob");

const ENTITY_DIRS = {
  jurisdictions: "jurisdiction.schema.json",
  agencies: "agency.schema.json",
  services: "service.schema.json",
  bodies: "body.schema.json",
  people: "person.schema.json",
  positions: "position.schema.json",
  domains: "domain.schema.json",
};

function loadSchemas() {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const schemasDir = path.join(__dirname, "schemas");
  const metaSchema = JSON.parse(
    fs.readFileSync(path.join(schemasDir, "meta.schema.json"), "utf8")
  );
  ajv.addSchema(metaSchema);

  const validators = {};
  for (const [dir, schemaFile] of Object.entries(ENTITY_DIRS)) {
    const schema = JSON.parse(
      fs.readFileSync(path.join(schemasDir, schemaFile), "utf8")
    );
    validators[dir] = ajv.compile(schema);
  }

  return validators;
}

function getChangedFiles() {
  try {
    const base = process.env.GITHUB_BASE_REF || "main";
    const output = execSync(
      `git diff --name-only --diff-filter=ACM ${base}...HEAD`,
      { encoding: "utf8" }
    );
    return output
      .trim()
      .split("\n")
      .filter((f) => f.endsWith(".json") && !f.startsWith("schemas/"));
  } catch {
    return [];
  }
}

function getStagedFiles() {
  try {
    const output = execSync(
      `git diff --cached --name-only --diff-filter=ACM`,
      { encoding: "utf8" }
    );
    return output
      .trim()
      .split("\n")
      .filter((f) => f.endsWith(".json") && !f.startsWith("schemas/") && !f.startsWith("package"));
  } catch {
    return [];
  }
}

function getAllJsonFiles() {
  return globSync("**/*.json", {
    ignore: ["schemas/**", "node_modules/**", "package.json", "package-lock.json"],
  });
}

function getEntityDir(filePath) {
  const parts = filePath.split(path.sep);
  return parts[0];
}

function validateFile(filePath, validator) {
  const raw = fs.readFileSync(filePath, "utf8");

  // Skip LFS pointer files
  if (raw.startsWith("version https://git-lfs.")) {
    return { skipped: true, reason: "LFS pointer (run git lfs pull first)" };
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { valid: false, errors: [`Invalid JSON: ${e.message}`] };
  }

  const valid = validator(data);
  if (!valid) {
    const errors = validator.errors.map(
      (e) => `  ${e.instancePath || "/"}: ${e.message}`
    );
    return { valid: false, errors };
  }

  return { valid: true };
}

function main() {
  const changedOnly = process.argv.includes("--changed");
  const stagedOnly = process.argv.includes("--staged");
  const validators = loadSchemas();

  const files = stagedOnly ? getStagedFiles() : changedOnly ? getChangedFiles() : getAllJsonFiles();

  if (files.length === 0) {
    console.log(changedOnly ? "No changed JSON files to validate." : "No JSON files found.");
    process.exit(0);
  }

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const file of files) {
    const dir = getEntityDir(file);
    const validator = validators[dir];

    if (!validator) {
      console.log(`?  ${file} (no schema for ${dir}/)`);
      skipped++;
      continue;
    }

    const result = validateFile(file, validator);

    if (result.skipped) {
      console.log(`-  ${file} (${result.reason})`);
      skipped++;
    } else if (result.valid) {
      console.log(`ok ${file}`);
      passed++;
    } else {
      console.log(`FAIL ${file}`);
      result.errors.forEach((e) => console.log(e));
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed, ${skipped} skipped`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
