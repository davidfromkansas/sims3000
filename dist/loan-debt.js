// The remaining contractual payments include principal and interest. Each of
// ten annual installments is 15% of the original principal (manual p. 91).
export const outstandingLoanPayments=c=>c.finance.loans.reduce((total,loan)=>total+loan.principal*.15*(10-loan.paymentsMade),0);
