interface CalculationRequest {
  adherantId: number;
  actes: string[];
  totalCotation: number;
  assuranceId: number;
  assuranceName: string;
}

interface CalculationResponse {
  totalOrdonnance: number;
  montantTicketModerateur: number;
  montantRembourse: number;
}
