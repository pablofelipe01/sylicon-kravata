# Pruebas para el Webhook de Kravata

## Caso 1: Usuario Aprobado
```bash
curl -X POST http://localhost:3000/api/webhook/kravata \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "kyc.approved",
    "externalId": "test-user-001",
    "userId": "kravata-user-123",
    "timestamp": "2025-03-26T15:30:45Z",
    "status": "approved"
  }'
```

## Caso 2: Usuario Rechazado
```bash
curl -X POST http://localhost:3000/api/webhook/kravata \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "kyc.rejected",
    "externalId": "test-user-002",
    "rejectionReason": "Documento de identidad no válido",
    "timestamp": "2025-03-26T16:15:20Z",
    "status": "rejected"
  }'
```

## Caso 3: Usuario Pendiente
```bash
curl -X POST http://localhost:3000/api/webhook/kravata \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "kyc.pending",
    "externalId": "test-user-003",
    "timestamp": "2025-03-26T17:05:10Z",
    "status": "pending",
    "message": "Se requiere verificación adicional"
  }'
```