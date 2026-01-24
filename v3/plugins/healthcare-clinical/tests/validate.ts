/**
 * Healthcare Clinical Plugin - Validation Script
 * Validates that all MCP tools work correctly with test data.
 */

import {
  healthcareTools,
  patientSimilarityTool,
  drugInteractionsTool,
  clinicalPathwaysTool,
  literatureSearchTool,
  ontologyNavigateTool,
  toolHandlers,
} from '../dist/mcp-tools.js';

const PASS = '\x1b[32mPASS\x1b[0m';
const FAIL = '\x1b[31mFAIL\x1b[0m';

interface ValidationResult {
  tool: string;
  passed: boolean;
  error?: string;
}

async function validateTool(
  name: string,
  handler: (input: Record<string, unknown>, context?: unknown) => Promise<{ success: boolean; data?: unknown; error?: string }>,
  input: Record<string, unknown>
): Promise<ValidationResult> {
  try {
    const result = await handler(input);

    if (!result.success && result.error) {
      return { tool: name, passed: false, error: result.error };
    }

    // Verify result structure
    if (typeof result !== 'object') {
      return { tool: name, passed: false, error: 'Result is not an object' };
    }

    return { tool: name, passed: true };
  } catch (err) {
    return { tool: name, passed: false, error: String(err) };
  }
}

async function main() {
  console.log('Healthcare Clinical Plugin - MCP Tools Validation\n');
  console.log('='.repeat(60));

  const results: ValidationResult[] = [];

  // 1. Patient Similarity Tool
  console.log('\n1. Testing healthcare/patient-similarity...');
  results.push(await validateTool(
    'healthcare/patient-similarity',
    patientSimilarityTool.handler,
    {
      patientFeatures: {
        diagnoses: ['E11.9', 'I10'],
        medications: ['metformin', 'lisinopril'],
        labResults: { hba1c: 7.5, creatinine: 1.2 },
      },
      topK: 5,
    }
  ));

  // 2. Drug Interactions Tool
  console.log('2. Testing healthcare/drug-interactions...');
  results.push(await validateTool(
    'healthcare/drug-interactions',
    drugInteractionsTool.handler,
    {
      medications: ['warfarin', 'aspirin', 'ibuprofen'],
      conditions: ['atrial fibrillation'],
      severity: 'major',
    }
  ));

  // 3. Clinical Pathways Tool
  console.log('3. Testing healthcare/clinical-pathways...');
  results.push(await validateTool(
    'healthcare/clinical-pathways',
    clinicalPathwaysTool.handler,
    {
      primaryDiagnosis: 'E11',
      constraints: {
        excludeMedications: ['insulin'],
      },
    }
  ));

  // 4. Literature Search Tool
  console.log('4. Testing healthcare/literature-search...');
  results.push(await validateTool(
    'healthcare/literature-search',
    literatureSearchTool.handler,
    {
      query: 'type 2 diabetes metformin efficacy',
      sources: ['pubmed'],
      maxResults: 5,
      evidenceLevel: 'rct',
    }
  ));

  // 5. Ontology Navigate Tool
  console.log('5. Testing healthcare/ontology-navigate...');
  results.push(await validateTool(
    'healthcare/ontology-navigate',
    ontologyNavigateTool.handler,
    {
      code: 'E11',
      ontology: 'icd10',
      direction: 'descendants',
      depth: 2,
    }
  ));

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION SUMMARY\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  for (const result of results) {
    console.log(`  ${result.passed ? PASS : FAIL} ${result.tool}`);
    if (result.error) {
      console.log(`      Error: ${result.error.slice(0, 100)}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('Exported tools:', healthcareTools.length);
  console.log('Handler map size:', toolHandlers.size);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Validation failed:', err);
  process.exit(1);
});
