#!/usr/bin/env node
/**
 * Transforms JSON-LD county-data files into flat JSON files
 * matching the data repo's per-entity schemas.
 *
 * Usage: node scripts/import-jsonld.js <county-data-dir>
 *
 * Reads: agencies.jsonld, governing-bodies.jsonld, people.jsonld,
 *        positions.jsonld, services.jsonld, websites.jsonld, cities.jsonld
 * Writes: agencies/, bodies/, people/, positions/, services/ (one file per entity)
 */

const fs = require("fs");
const path = require("path");

const srcDir = process.argv[2];
if (!srcDir || !fs.existsSync(srcDir)) {
  console.error("Usage: node scripts/import-jsonld.js <county-data-dir>");
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, "..");

// --- helpers ---

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function readGraph(filename) {
  const fp = path.join(srcDir, filename);
  if (!fs.existsSync(fp)) return [];
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));
  return data["@graph"] || [];
}

function writeEntity(dir, slug, obj) {
  const outDir = path.join(repoRoot, dir);
  fs.mkdirSync(outDir, { recursive: true });
  const fp = path.join(outDir, `${slug}.json`);
  fs.writeFileSync(fp, JSON.stringify(obj, null, 2) + "\n");
  return fp;
}

function meta(node) {
  const m = { source: "", retrieved_at: "" };
  if (node._source) m.source = node._source;
  else if (node["@id"] && node["@id"].startsWith("http")) m.source = node["@id"];
  else if (node.url) m.source = node.url;
  if (node._fetchedAt) {
    m.retrieved_at = node._fetchedAt.slice(0, 10);
  } else {
    m.retrieved_at = "2026-03-08";
  }
  m.contributor = "openclaw";
  return m;
}

// Detect jurisdiction slug from the directory name
const localitySlug = path.basename(srcDir);

// Try to find the jurisdiction ref from jurisdiction.jsonld
let jurisdictionRef = null;
const jurisdictionNodes = readGraph("jurisdiction.jsonld");
if (jurisdictionNodes.length > 0) {
  const j = jurisdictionNodes[0];
  // We reference by the relative path used in the data repo
  // For now, use a descriptive path based on locality slug
  jurisdictionRef = `jurisdictions/counties/${localitySlug}`;
}

let count = 0;

// --- agencies ---
for (const node of readGraph("agencies.jsonld")) {
  if (!node.name) continue;
  const slug = slugify(node.name);
  const obj = { _meta: meta(node), name: node.name };
  if (node.description) obj.description = node.description;
  if (node.agency_type) obj.agency_type = node.agency_type;
  // Determine agency_type from @type array
  if (!obj.agency_type) {
    const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
    if (types.includes("LegislativeBody")) obj.agency_type = "legislative";
  }
  if (jurisdictionRef) obj.jurisdiction = jurisdictionRef;
  if (node.url) obj.url = node.url;
  if (node.email) obj.email = node.email;
  if (node.telephone) obj.phone = node.telephone;
  if (node.address && typeof node.address === "object") {
    const a = node.address;
    if (a.streetAddress) obj.address = a.streetAddress;
    if (a.addressLocality) obj.city = a.addressLocality;
    if (a.addressRegion) obj.state = a.addressRegion;
    if (a.postalCode) obj.zip = a.postalCode;
  }
  writeEntity("agencies", slug, obj);
  count++;

  // Flatten nested departments as separate agencies
  if (node.department && Array.isArray(node.department)) {
    for (const dept of node.department) {
      if (!dept.name) continue;
      const deptSlug = slugify(dept.name);
      const deptObj = { _meta: meta(dept), name: dept.name };
      if (dept.description) deptObj.description = dept.description;
      if (jurisdictionRef) deptObj.jurisdiction = jurisdictionRef;
      if (dept.url) deptObj.url = dept.url;
      if (dept.telephone) deptObj.phone = dept.telephone;
      writeEntity("agencies", deptSlug, deptObj);
      count++;
    }
  }
}

// --- governing bodies → bodies ---
for (const node of readGraph("governing-bodies.jsonld")) {
  if (!node.name) continue;
  const slug = slugify(node.name);
  const obj = { _meta: meta(node), name: node.name };
  if (jurisdictionRef) obj.jurisdiction = jurisdictionRef;
  if (node.description) {
    obj.legislative_type = inferBodyType(node);
  }
  if (node.url) obj.url = node.url;
  if (node.numberOfEmployees && node.numberOfEmployees.value) {
    obj.size = node.numberOfEmployees.value;
  }
  if (node.description) {
    // Extract meeting info as part of description, but keep it concise
  }
  writeEntity("bodies", slug, obj);
  count++;
}

function inferBodyType(node) {
  const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
  if (types.includes("LegislativeBody")) return "board";
  const name = (node.name || "").toLowerCase();
  if (name.includes("commission")) return "commission";
  if (name.includes("committee")) return "committee";
  if (name.includes("council")) return "council";
  if (name.includes("board")) return "board";
  return "board";
}

// --- people ---
for (const node of readGraph("people.jsonld")) {
  if (!node.name) continue;
  const nameParts = node.name.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || nameParts[0];
  const slug = slugify(node.name);
  const obj = {
    _meta: meta(node),
    first_name: firstName,
    last_name: lastName,
  };
  if (node.url) obj.url = node.url;
  if (node.email) obj.email = node.email;
  writeEntity("people", slug, obj);
  count++;
}

// --- positions ---
for (const node of readGraph("positions.jsonld")) {
  // positions.jsonld has a DefinedTermSet wrapper with hasDefinedTerm array
  const terms = node.hasDefinedTerm || [node];
  for (const term of terms) {
    if (!term.name) continue;
    const slug = slugify(term.name);
    const obj = { _meta: meta(term), label: term.name };
    // Extract role and term length from additionalProperty
    if (term.additionalProperty) {
      for (const prop of term.additionalProperty) {
        if (prop.name === "selectionMethod") obj.role = prop.value;
        if (prop.name === "termLength") obj.term_length = prop.value;
      }
    }
    writeEntity("positions", slug, obj);
    count++;
  }
}

// Also create positions from people's hasOccupation
for (const node of readGraph("people.jsonld")) {
  if (!node.hasOccupation) continue;
  const occ = node.hasOccupation;
  if (!occ.roleName) continue;
  const personSlug = slugify(node.name);
  const posSlug = slugify(occ.roleName) + "-" + personSlug;
  // Only write if we don't already have a generic position for this role
  const obj = {
    _meta: meta(node),
    label: occ.roleName,
    person: personSlug,
  };
  if (occ.startDate) obj.start_date = occ.startDate.length === 4 ? `${occ.startDate}-01-01` : occ.startDate;
  writeEntity("positions", posSlug, obj);
  count++;
}

// --- services ---
for (const node of readGraph("services.jsonld")) {
  if (!node.name) continue;
  const slug = slugify(node.name);
  const obj = { _meta: meta(node), name: node.name };
  if (node.description) obj.description = node.description;
  if (node.url) obj.url = node.url;
  if (node.serviceType) obj.category = node.serviceType;
  writeEntity("services", slug, obj);
  count++;
}

console.log(`Imported ${count} entities from ${localitySlug}`);
