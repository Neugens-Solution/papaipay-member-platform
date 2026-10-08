export const correctionReasons = {
  ID_UNCLEAR: ["Identification Document Unclear", "Please upload a clear, readable image showing the entire identification document."],
  ID_INCOMPLETE: ["Identification Document Incomplete", "Please upload the complete identification document, including both sides."],
  ID_EXPIRED: ["Identification Document Expired", "Please provide a valid identification document."],
  INFO_MISMATCH: ["Information Does Not Match Identification Document", "Please check and correct the information in your application."],
  DOCUMENT_MISSING: ["Required Document Missing", "Please upload the requested document."],
  DOCUMENT_INVALID: ["Invalid or Unsupported Document", "Please upload a valid supported document."],
  ADDRESS_PROOF_REQUIRED: ["Proof of Address Required", "Please provide the requested proof of address."],
  BANK_INFO_INVALID: ["Bank Information Incomplete or Invalid", "Please review and update your bank information."],
  APPLICATION_INCOMPLETE: ["Application Information Incomplete", "Please complete the missing application information."],
  DUPLICATE_APPLICATION: ["Possible Duplicate Application", "Please review your application or follow the administrator's instructions."],
  OTHER: ["Other", "Please follow the administrator's note below."],
} as const;

export type CorrectionReasonCode = keyof typeof correctionReasons;

export function correctionReasonText(code: string, note?: string | null) {
  const reason = correctionReasons[code as CorrectionReasonCode];
  return reason ? `${reason[0]}. ${reason[1]}${note ? ` Additional note: ${note}` : ""}` : code;
}
