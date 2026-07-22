# Fiscal Documents Reference — NestJS ERP Module

> Sources: SEFAZ layout 4.00, Focus NFe API docs, Stripe Tax docs, LC 116/2003.

## 1. Document Types

| Types | Purpose | Authority |
|-------|---------|-----------|
| **NF-e** (55) | Goods B2B/B2C | SEFAZ state |
| **NFC-e** (65) | Consumer POS | SEFAZ state |
| **NFS-e** | Services | Municipality |
| **CT-e** | Freight | SEFAZ |

## 2. NF-e XML — Mandatory Fields

**ide:** UF, CNPJ, naturezaOp, serie, nNF, dhEmis, tpNF(0=ent/1=sai), finNFe(1=normal), mod=55 → builds **chave** 44-digit: UF+AAMM+CNPJ+mod+serie+nNF+tpEmis+cNF+cDV.
**emit:** CNPJ, xNome, enderEmit, IE, CRT(1=SN / 3=normal).
**dest:** CPF/CNPJ, xNome, enderDest, indIEDest(1=contrib / 2=isento / 9=não).
**det nItem:** prod(cProd,NCM,CFOP,qCom,vUnCom,vProd) + imposto(ICMS/PIS/COFINS/IPI).
**total/ICMSTot:** vBC, vICMS, vIPI, vPIS, vCOFINS, vNF.
**transp:** modFrete(9=sem frete).
**pag:** tPag, vPag, card when applicable.

## 3. Tax Codes Table

### CST (regime normal)
| Code | Meaning |
|------|---------|
| 00 | Tributada integralmente |
| 10 | Tributada com ICMS-ST |
| 20 | Redução de base |
| 30 | Isenta / não tributada com ST |
| 40 | Isenta |
| 41 | Não tributada |
| 51 | Diferimento |
| 60 | ICMS cobrado ant. por ST |
| 70 | Redução + ST |
| 90 | Outros |

### CSOSN (Simples)
101/102/103, 201/202/203, 300, 400, 500, 900.

### PIS/COFINS CST
01/02 = cumulativo; 04 = não-cumulativo isento; 49 = outras; 99 = sem incidência.

## 4. Tax Calculation Rules

**ICMS (normal):** base = vProd + vFrete + vSeg + vOutro − vDesc; vICMS = base × alíq interestadual (7% Sul→Norte, 12% geral, 4% importado).
**ICMS-ST:** baseST = vProd × (1+MVA%); vST = baseST × alíqInterna − vICMSpróprio.
**PIS cumulativo:** 0.65%; **não cumulativo:** 1.65%.
**COFINS cumulativo:** 3.00%; **não cumulativo:** 7.60%.
**ISS:** vISS = (valorServicos − deducoes) × alíquota (2-5%). ISS retido na fonte pelo tomador.

## 5. NFS-e Specifics
- **RPS** (Recibo Provisório): serie+numero+tipo when webservice down; batch as `<LoteRPS>`.
- Key fields: prestador(cnpj, inscricao_municipal, codigo_municipio IBGE 7-digit), tomador(cnpj/cpf, razao_social, endereco), servico(item_lista_servico, codigo_tributacao_municipio, discriminacao, valor_servicos, aliquotaISS).
- Layouts: Betha, GINFES, ISSNet — 30+ variants by city.
- National NFS-e (DPS) adds IBS/CBS fields for Reforma Tributária.

## 6. NFC-e Specifics
- Model 65, **synchronous** emission, QR Code for offline consumer check.
- **CSC** security code from SEFAZ; contingency offline needs manual numero/serie/cNF.
- Cancelamento ≤30min. DANFE is HTML (not PDF).

## 7. NF-e Lifecycle State Machine
```
draft → submit → processing → authorized → cancel|corrected
                  processing → denied
```
- **authorized → cancelled** ≤24h (nfe) / ≤30min (nfce).
- **authorized → corrected** via CCe (≤20 letters; cannot change: tax values, emission date, issuer/recipient).
- Denied/cancelled are terminal — a new document is issued for further changes.

## 8. SEFAZ Integration via Broker

ERP → JSON → **Broker adapter (FocusNFe, WebmaniaNFe)** → sign XML (A1 cert) → SOAP `NfeAutorizacao4` → consult `NfeRetAutorizacao4` → status 100=autorizado, 105=pendente, 110=denegado.
Events: cancel, CCe, substitution, inutilização. Contingência: FS-DA/SVC if SEFAZ offline — efetivar within 8-72h.

## 9. International Invoicing
**EU VAT Invoice:** seller+buyer VAT IDs, reverse charge on cross-border B2B, OSS/IOSS thresholds. Fields: number, date, description, qty, unit price, VAT rate, VAT amount, total.
**US Sales Tax:** state+local destination-based. Fields: nexus jurisdiction, product tax code, tax rate, total tax.
**Commercial Invoice (exports):** exporter/consignee, Incoterms, HS code, currency, country of origin, shipping marks.
**Stripe Tax API:** `POST /v1/tax/calculations`, input `{customer_details.address, line_items[].product_tax_code, ship_from_address}`, output `{tax_amount_exclusive, tax_breakdown[]}`. 60+ countries. Does **not** issue Brazilian XML.

## 10. Database Schema (Core Tables)

**fiscal_document:** id, tenant_id, type(nfe|nfce|nfse|cte), status, environment(1=prod|2=hom), model(55|65), series, number, unique_code(cNF), access_key(44), issuer_cnpj, recipient_doc+name, emission_at, total_value, tax_total, payload(JSONB), xml_path, danfe_path, qr_code_url, contingency, broker_ref, broker_provider.

**fiscal_item:** document_id, item_number, product_code, description, ncm, cfop, csosn, cst_icms/pis/cofins/ipi, quantity, unit_value, total_value, icms/st/pis/cofins/ipi _base/rate/value, iss_base/rate/value, iss_retido, item_lista_servico, codigo_tributario.

**tax_rate:** tenant_id, name, type(icms|icms_st|pis|cofins|ipi|iss), origin_uf, dest_uf, ncm, cfop, cst, csosn, rate, mva, valid_from, valid_until.

**fiscal_event:** document_id, type(cancel|ccci|correction|denial|substitution), sequence, reason, protocol, registered_at, payload(JSONB).

## 11. Integration Adapter Pattern

```typescript
interface FiscalBrokerAdapter {
  readonly provider: string;
  emit(input: EmitInput): Promise<EmitResult>;
  consult(ref: string): Promise<ConsultResult>;
  cancel(ref: string, reason: string): Promise<CancelResult>;
  correction(ref: string, changes: CorrectionInput): Promise<CorrectionResult>;
}
// Implementations: FocusNFeAdapter, WebmanianfeAdapter, StripeTaxAdapter
// Factory selects per tenant config — returns normalized EmitResult {status, accessKey, xmlPath, danfePath, qrCodeUrl?}
```
