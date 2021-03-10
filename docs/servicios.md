---
id: servicios
title: Servicios
sidebar_label: Servicios
---

## Accounts


_Service_ ```@Injectable()``` para el modelo [Accounts](/docs/modelos#accounts)



>
```typescript
async findPortfolioByNumber(accountNumber: number): Promise<any>
```
Crea el portfolio del usuario logueado en integracion con [ESCO-SERVICE](/docs/integracion) con iconos
* _@params_ : 
  * accountNumber: Numero de cuenta del usuario logueado.
* _return_ :
  * Devuelve el portfolio del usuario con iconos.

```typescript
async findPortfolioByNumber(accountNumber: number): Promise<any> { 
        try {
            const userPortfolio = await this.escoService.getTenenciaVal({
                cuentas: accountNumber.toString(),
                fecha: this.toolbox.toEscoDateFormat(new Date()),
                porConcertacion: true,
                esConsolidado: false,
                pppFuenteOriginal: true,
                agruparPorMoneda: true,
                monedaValuacion: "string"
            });
            const portfolioWithIcons = await Promise.mapSeries(userPortfolio, async (anInstrument) => {
                const iconUrl = await this.instrumentsService.getIconUrlByTicker(anInstrument.abreviatura);
                if(iconUrl) return { ...anInstrument, ...{iconUrl : iconUrl} };
                return anInstrument;
            });
            return { accountNumber: accountNumber, portfolio: portfolioWithIcons }; 
        } catch(exception){
            throw new BadRequestException(exception.message);
        }
    }
```

