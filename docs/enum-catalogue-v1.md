# PAPAIPAY Portal V1 Enum Catalogue

This catalogue defines approved backend enum values for the production data contract. It is documentation only and introduces no runtime behavior.

## Campaign lifecycle status

| Value | Meaning | Member visibility |
| --- | --- | --- |
| `Draft` | Campaign record is being prepared by Admin. | Hidden |
| `Open` | Campaign is visible and accepting Participation Amount submissions through the future payment gateway flow. | Visible |
| `Funded` | Campaign Target has been reached or participation intake is closed successfully. | Visible |
| `Holding` | Property is in the holding period. | Visible in Portfolio |
| `Sold` | Property sale has completed and settlement can be prepared. | Visible update |
| `Distribution Processing` | Settlement is locked and manual distribution processing is underway. | Visible distribution status |
| `Distributed` | All distribution records in the batch are Paid. | Visible as completed outcome |
| `Cancelled` | Campaign has been withdrawn or stopped. | Visible only where needed |

## Publish status

| Value | Meaning |
| --- | --- |
| `Draft` | Not published. |
| `Published` | Available to intended audience. |
| `Archived` | Retained for records but not active. |

## Visibility

| Value | Meaning |
| --- | --- |
| `Internal Only` | Admin-only. |
| `Member Visible` | Visible to members. |
| `Participants Only` | Visible only to members with confirmed participation in the campaign. |

## Tenure

| Value | Meaning |
| --- | --- |
| `Freehold` | Full tenure wording for rows/forms. |
| `Leasehold` | Full tenure wording for rows/forms. |

## Tenure alias

| Value | Meaning |
| --- | --- |
| `FH` | Compact Freehold badge. |
| `LH` | Compact Leasehold badge. |

## Bumi status

| Value |
| --- |
| `Bumi` |
| `Non-Bumi` |
| `Open Market` |

## Return type

| Value | Meaning |
| --- | --- |
| `Fixed` | Fixed holding return configuration. |
| `Target` | Target holding return configuration. |
| `Up To` | Capped holding return configuration. |

## Principal protection status

| Value | Meaning |
| --- | --- |
| `Enabled` | Principal protection rule is enabled. |
| `Disabled` | Principal protection rule is disabled. |

## Member verification status

| Value | Meaning |
| --- | --- |
| `Not Started` | e-KYC has not started. |
| `Pending` | e-KYC is in progress. |
| `Approved` | Member passed required verification. |
| `Rejected` | Member did not pass required verification. |
| `Manual Review` | Admin review is required. |
| `Expired` | Provider session expired. |
| `Cancelled` | Member or provider cancelled the flow. |

## Member account status

| Value |
| --- |
| `Active` |
| `Suspended` |
| `Closed` |

## Admin account status

| Value |
| --- |
| `Invited` |
| `Active` |
| `Suspended` |

## Admin roles

| Value | Typical purpose |
| --- | --- |
| `Super Admin` | Full platform governance. |
| `Admin` | General operations. |
| `Manager` | Campaign lifecycle and reports. |
| `Finance Admin` | Settlement and distribution workflows. |
| `Compliance Reviewer` | e-KYC and sensitive review workflows. |
| `Support Admin` | Member support with restricted access. |
| `Read Only` | View-only operations. |

## Participation status

| Value | Meaning |
| --- | --- |
| `Pending Payment` | Participation record created before payment success. |
| `Confirmed` | Payment success verified and participation is active. |
| `Cancelled` | Participation was cancelled. |
| `Refunded` | Payment has been returned through approved operations. |

## Payment status

| Value | Meaning |
| --- | --- |
| `Pending` | Payment record created. |
| `Processing` | Gateway processing is underway. |
| `Succeeded` | Gateway success verified. |
| `Failed` | Gateway reported failure. |
| `Cancelled` | Member cancelled or gateway cancelled. |
| `Expired` | Checkout session expired. |
| `Refunded` | Payment has been returned through gateway process. |

## Payment event processing status

| Value |
| --- |
| `Received` |
| `Processed` |
| `Ignored` |
| `Failed` |

## Settlement calculation status

| Value | Meaning |
| --- | --- |
| `Draft` | Calculation is being prepared. |
| `Reviewed` | Finance/Admin has reviewed calculation. |
| `Approved` | Calculation is approved for distribution batch generation. |
| `Locked` | Calculation is locked and should not be edited casually. |

## Distribution batch status

| Value |
| --- |
| `Draft` |
| `Approved` |
| `Processing` |
| `Completed` |
| `Cancelled` |

## Distribution status

| Value | Meaning |
| --- | --- |
| `Pending` | Distribution record created but not processed. |
| `Processing` | Manual transfer workflow underway. |
| `Paid` | Manual transfer recorded with payment date/reference. |

## Document category

| Value |
| --- |
| `Proclamation of Sale` |
| `Conditions of Sale` |
| `Title Search` |
| `Valuation Report` |
| `Property Photos` |
| `Location Map` |
| `Legal Documents` |
| `Other Documents` |

## Document status

| Value |
| --- |
| `Draft` |
| `Ready` |
| `Published` |
| `Archived` |

## File visibility

| Value |
| --- |
| `Public` |
| `Private` |

## Report status

| Value |
| --- |
| `Pending` |
| `Generated` |
| `Failed` |

## Notification status

| Value |
| --- |
| `Draft` |
| `Published` |
| `Read` |
| `Archived` |

## Bank account verification status

| Value | Meaning |
| --- | --- |
| `Pending` | Awaiting admin verification. |
| `Verified` | Bank account has passed admin review. |
| `Rejected` | Bank account failed admin review. |

## Manual KYC status

| Value | Meaning |
| --- | --- |
| `NotSubmitted` | Member has not submitted manual KYC. |
| `Submitted` | Member submitted manual KYC documents. |
| `UnderReview` | Admin review is in progress. |
| `Approved` | Manual KYC is approved. |
| `Rejected` | Manual KYC is rejected. |
| `ResubmissionRequired` | Member must resubmit one or more documents. |

## Manual KYC document type

| Value | Meaning |
| --- | --- |
| `IcFront` | Front of IC. |
| `IcBack` | Back of IC. |
| `SelfieHoldingIc` | Selfie while holding IC. |
| `BankStatement` | Bank statement for name/account review. |

## Manual KYC document status

| Value | Meaning |
| --- | --- |
| `Pending` | Document is awaiting review. |
| `Accepted` | Document passed review. |
| `Rejected` | Document failed review. |

## Settlement scenario

| Value | Meaning |
| --- | --- |
| `SuccessfulExit` | Sale completed and final distribution may include Principal Return, Holding Return, and Profit Distribution. |
| `PrincipalOnlyAfterMaxHoldingPeriod` | 24-month rule triggered; Participation Amount only is returned. |
