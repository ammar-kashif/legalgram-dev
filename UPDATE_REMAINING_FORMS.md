# Guide to Update Remaining Document Forms

## Overview
This guide provides step-by-step instructions to add the user information collection step to all remaining document forms.

## Pattern to Follow

### 1. Import UserInfoStep Component
Add to the imports section:
```typescript
import UserInfoStep from "@/components/UserInfoStep";
```

### 2. Add State Management
Add these state variables to the component:
```typescript
const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
```

### 3. Update Step/Section Structure
For **step-based forms** (like NDAForm):
- Increase total steps by 1
- Add user info as the final step before completion
- Update `canAdvance()` function to handle the new step
- Update step navigation logic

For **section-based forms** (like LeaseTerminationForm):
- Add a new section for user info
- Update the flow to include the user info section before confirmation

### 4. Update PDF Generation Function
```typescript
const generatePDF = () => {
  setIsGeneratingPDF(true);
  
  try {
    // ... existing PDF generation logic ...
    
    doc.save('document-name.pdf');
    toast.success("Document generated successfully!");
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error("Failed to generate document");
  } finally {
    setIsGeneratingPDF(false);
  }
};
```

### 5. Add UserInfoStep to Render Logic
For **step-based forms**:
```typescript
case [FINAL_STEP_NUMBER]:
  return (
    <UserInfoStep
      onBack={handleBack}
      onGenerate={generatePDF}
      documentType="[Document Type Name]"
      isGenerating={isGeneratingPDF}
    />
  );
```

For **section-based forms**:
```typescript
if (questionId === 'user_info_step') {
  return (
    <UserInfoStep
      onBack={handleBack}
      onGenerate={generatePDF}
      documentType="[Document Type Name]"
      isGenerating={isGeneratingPDF}
    />
  );
}
```

### 6. Update Footer/Navigation Logic
Hide the default footer/navigation buttons when on the user info step:
```typescript
{currentStep !== [USER_INFO_STEP_NUMBER] && (
  <CardFooter className="flex justify-between">
    {/* ... existing footer content ... */}
  </CardFooter>
)}
```

## Forms to Update

### ✅ Recently Completed Forms
1. `SpecialPowerOfAttorneyForm.tsx` ✅ Completed
2. `StorageSpaceLeaseForm.tsx` ✅ Completed  
3. `SubleaseForm.tsx` ✅ Completed
4. `TranscriptRequestForm.tsx` ✅ Completed (was already done)
5. `TripleNetLeaseForm.tsx` ✅ Completed
6. `WarehouseLeaseForm.tsx` ✅ Completed

### High Priority Forms (Most Used)
1. `GeneralContractForm.tsx` ✅ Started
2. `BusinessAgreementForm.tsx`
3. `BuySellAgreementForm.tsx`
4. `CommercialLeaseForm.tsx`
5. `LoanAgreementForm.tsx`
6. `ServicesContractForm.tsx`

### Medium Priority Forms
7. `AgreementToSellForm.tsx`
8. `CorporationFormation.tsx`
9. `LLCBusinessFormation.tsx`
10. `LLCOperatingAgreementForm.tsx`
11. `NonprofitFormation.tsx`
12. `CorporateBylawsForm.tsx`

### Lower Priority Forms
13. All remaining lease forms
14. All affidavit forms
15. All copyright/patent forms
16. All power of attorney forms

## Quality Checklist

For each form updated, verify:
- [ ] Import statement added
- [ ] State management for PDF generation added
- [ ] User info step properly integrated
- [ ] PDF generation wrapped with loading state
- [ ] Navigation logic updated
- [ ] Error handling implemented
- [ ] Document type name correctly specified
- [ ] Footer/navigation hidden during user info step

## Testing Checklist

- [ ] Form flows correctly through all steps
- [ ] User info validation works (email format, required fields)
- [ ] PDF generates after user info submission
- [ ] Back button works from user info step
- [ ] Loading states display correctly
- [ ] Error messages show appropriately
- [ ] Data is stored in Supabase `document_users` table

## Example Implementation

See `src/components/NDAForm.tsx` and `src/components/LeaseTerminationForm.tsx` for complete reference implementations.

## Document Type Names Reference

Use these exact names for consistency:
- "Non-Disclosure Agreement"
- "Lease Termination Agreement"  
- "General Contract"
- "Business Agreement"
- "Buy-Sell Agreement"
- "Commercial Lease Agreement"
- "Loan Agreement"
- "Services Contract"
- etc.

## Notes

- Each form may have slightly different structures (step-based vs section-based)
- Adapt the pattern to fit the existing form structure
- Maintain consistency with existing validation and error handling
- Test thoroughly before considering complete
