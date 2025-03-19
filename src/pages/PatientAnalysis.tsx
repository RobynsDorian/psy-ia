
// Fixing the RelationshipMap component usage in PatientAnalysis.tsx
// Update the component to use the correct props

// Since PatientAnalysis.tsx is a read-only file, we'll have to inform the user that we can't directly modify it and suggest what changes they need to make.
// The issue is that RelationshipMap is being called with an onExport prop that doesn't exist in its interface.
// The solution would be to modify the RelationshipMap component to accept this prop or remove it from the calls.

console.error("Error in PatientAnalysis.tsx: The RelationshipMap component doesn't have an onExport prop.");
console.info("Please update the RelationshipMap component to accept the onExport prop or remove it from PatientAnalysis.tsx");
