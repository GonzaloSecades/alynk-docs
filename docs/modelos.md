---
id: modelos
title: Modelos
sidebar_label: Modelos
---
## Accounts

Modelo de cuentas para los usuarios. 

Cada usuario puede tener una cuenta en pesos como en dolares.

Asi como tambien un usuario puede tener acceso a otras cuentas comitentes junto con las suyas propias.



| id   | name     | cuit     | alias    | number   | users                       | isActive  |
| ---- | -------- | -------- | -------- | -------- | --------------------------- | --------- |
| _PK_ | _string_ | _string_ | _string_ | _number_ | _many to many - join table_ | _boolean_ |

* **ID** : Autoincremental, unique identifier .
* **name**:  Account Name.
* **CUIT**:  Client identifier.
* **alias** : Account alias.
* **number** : Account number.
* **Users** : # of users for this account. Could be one or many
* **isActive**: ```TRUE or FALSE```.  Active client



```typescript
@Entity()
export class Account {
  constructor(name, cuit, alias, number, isActive) {
    this.name = name;
    this.cuit = cuit;
    this.alias = alias;
    this.number = number;
    this.isActive = isActive || false;
  }
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column({ length: 140, nullable: true })
  name: string;

  @ApiProperty()
  @Column({ length: 14, nullable: true })
  cuit: string;

  @ApiProperty()
  @Column({ length: 140, unique: true })
  alias: string;

  @ApiProperty()
  @Column('int', {nullable: true})
  number: number;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.accounts, { cascade: false, eager: true })
  @JoinTable({name: 'user_account'})
  users: User[];

  @ApiProperty()
  @Column({default: false})
  isActive: Boolean;

  addUser(aUser: User) {
    if(!Array.isArray(this.users)) {
      this.users = [];
    }
    this.users.push(aUser);
  }
}
```
---
## Instruments

Modelo de los instrumentos para ser guardados en el portfolio de cada usuario o cuenta.

La informacion de cada instrumento proviene directamente de ESCO tanto posicion consolidada en la cuenta comitente como precios de mercado de cada uno.

| ticker   | market   | currency |
| -------- | -------- | -------- |
| _string_ | _number_ | _string_ |

* **TICKER** : ```STRING``` Instrument ticker name (ej: "Banco Macro" => "BMA").
* **MARKET**: ``` NUMBER``` market number as listed on ESCO API.
* **CURRENCY**: ```STRING``` Client identifier.


```javascript
export class Instrument {
  constructor(){}

  @ApiProperty()
  @IsDefined()
  ticker: string;
  
  @ApiProperty()
  @IsDefined()
  market: string;
 
  @ApiProperty()
  @IsDefined()
  currency: string;
}
```
>Ticker reference : 
  * ##### [Empresas](https://www.byma.com.ar/emisoras/empresas-listadas/)  
  * ##### [Bonos](https://www.byma.com.ar/titulos-publicos/#ppt)
  * ##### [Cedears](https://www.byma.com.ar/cedears/)

>Market reference
  * #### [Market](https://api.sistemasesco.com/swagger-ui/documentos/Instructivo_Esco_Api_VisualBolsa_v6.pdf)

>Currency reference:
  * ##### [Currency](https://es.wikipedia.org/wiki/ISO_4217)

---

## Operations

Operaciones de comunicacion de _**RETIRO**_ y _**ENVIO**_ de dinero de los clientes desde o hacia sus cuentas.

| ID   | userId   | accountNumber | amount   | in        | account  | operationType | timestamp | closed    | currency | closedAt |
| ---- | -------- | ------------- | -------- | --------- | -------- | ------------- | --------- | --------- | -------- | -------- |
| _PK_ | _number_ | _number_      | _number_ | _boolean_ | _string_ | _string_      | _Date_    | _boolean_ | _string_ | _Date_   |

* **ID** : Autoincremental, unique identifier .
* **userId**:  User doing operation.
* **accountNumber**:  Account for the operation.
* **ammount** : Operation ammount.
* **in** : binary operation (In/Out). Indicates operation direction.
  * ```1 / true``` = _**In**_: Some user sent founds
  * ```0 / false``` = _**Out**_: Some user withdrew funds.
* **account** : In case of income operation we save here our account data affected by this operation
  * Ideally will be filled only if its an **IN** operation
* **operationType**: Indicates operation direction. binary(In/Out).
  * _In_ : Some user sent founds
  * _Out_ : Some user withdrew founds
* **timestamp**: Saves the time of the operation.
* **closed**: Indicates if operation was closed.
* **currency**: Indicates the operation currency
* **closedAt**: Indicates at what time the operation has been closed

```typescript
@Entity()
export class Operation {
  constructor(){
    this.timestamp = new Date();
    this.closed = false;
    this.in = true;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number;


  @Column('int')
  accountNumber: number;


  @Column('bigint')
  amount: number;


  @Column('bit')
  in: boolean;  


  @Column({nullable: true, default: null })
  account: string;


  @Column()
  operationType: string;  

  
  @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  timestamp: Date;

  
  @Column('bit')
  closed: boolean;

 
  @Column()
  currency: string;

 
  @Column({type:'timestamp', nullable: true })
  closedAt: Date;
}
```
---

## Order

Modelo para ordenes de mercado. 

Adaptacion de modelo para solicitud de operaciones de ESCO para futura implementacion de operacion en tiempo real.

> [Mep (Primera implementacion) ](/blog/MEP)

| id       | accountNumber | amount   | period   | price    | userId   | instrument   | escoOpCode | reminderAt | reminderSent | ticker   | timestamp |
| -------- | ------------- | -------- | -------- | -------- | -------- | ------------ | ---------- | ---------- | ------------ | -------- | --------- |
| _number_ | _number_      | _number_ | _number_ | _number_ | _number_ | _Instrument_ | _number_   | _Date_     | _boolean_    | _string_ | _date_    |

* **ID** : Autoincremental, unique identifier .
* **accountNumber**:  Account for the operation.
* **ammount** : Operation ammount.
* **period**: Arrenged time for market operation.(__hours_)
  * _PERIOD_CI = 0_
  * _PERIOD_24 = 1_
  * _PERIOD_48 = 2_
* **price** = Price operated.
* **userId**:  User doing operation.
* **Instrument**: Instrument for the operation.
* **escoOpCode**: [ESCO-API](https://api.sistemasesco.com/swagger-ui/documentos/Instructivo_Esco_Api_VisualBolsa_v6.pdf) operation code.
* **reminderAt**: Timestamp for setting reminder email for back office.
* **reminderSent**: Verification for reminder.
* **ticker**: Instrument ticker. (_ex: AL30_)
* **timestamp**: Saves the date of the operation.

```typescript
@Entity()
export class Order {
  static readonly PERIOD_CI = 0;
  static readonly PERIOD_24 = 1;
  static readonly PERIOD_48 = 2;
  
  constructor(){
    this.timestamp = new Date();
    this.reminderSent = false;
  }
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  accountNumber: number;

  @ApiProperty()
  @IsDefined()
  @Column('bigint')
  amount: number;
  
  @ApiProperty()
  @IsDefined()
  @Column()
  period: number;

  @ApiProperty()
  @IsDefined()
  @Column()
  price: number;

  @Column('int')
  userId: number;
  
  @ApiProperty()
  @IsDefined()
  instrument: Instrument;

  @Column()
  escoOpCode: number;

  @Column({type:'timestamp', nullable: true })
  reminderAt: Date;

  @Column('bit')
  reminderSent: boolean;

  @Column()
  ticker: string;

  @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  timestamp: Date;

```
---
## Settings

Tabla que guarda las condiciones de negocio para MEP por parte de alyk.

| id       | key      | value    |
| -------- | -------- | -------- |
| _number_ | _string_ | _string_ |

* **id** : Autoincremental, unique identifier .
* **key**:  value of data needed.
* **value** : JSON with business rules.


---

## Task

EmailReminder es una entidad auxiliar para generar registros del envio de operaciones solicitadas por el cliente.

Con estos datos se envian los mails a back office para la colocacion de las operaciones y se genera el registro en cada cliente de las operaciones solicitadas.


| id       | recipients | subject  | text     | scheduledDate | done      | sentDate |
| -------- | ---------- | -------- | -------- | ------------- | --------- | -------- |
| _number_ | _string_   | _string_ | _string_ | _Date_        | _boolean_ | _Date_   |

* **id** = Unique identifier.
* **recipients**:  Mail send to.
* **subject**: Mail subject.
* **text**: email body.
* **scheduledDate**: Scheduled date for mail reminder.
* **done**: Verification for reminder.
* **sentDate**: Date email was sent.
```typescript
@Entity()
export class EmailReminder {
  constructor(){
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  recipients: string;

  @Column({length: 255, charset: "utf8mb4", collation: "utf8mb4_unicode_ci"})
  subject: string;

  @Column({length: 255, charset: "utf8mb4", collation: "utf8mb4_unicode_ci"})
  text: string;

  @Column()
  scheduledDate: Date;

  @Column({default: false})
  done: boolean;

  @Column({nullable: true})
  sentDate: Date;
}
```
---

## Users

Modelo de usuario de la app. 

Cada usuario debe ser habilitado para operar luego de su registro.

Cada usuario puede tener una o mas cuentas comitentes para administrar. 

Asi como tambien cada comitente puede contar con cuentas en Pesos Argentinos ($) como en Dolares estadounidenses (U$S)

| id       | name     | cuit     | username | password | accountNumber | accounts    | isActive | notified  |
| -------- | -------- | -------- | -------- | -------- | ------------- | ----------- | -------- | --------- |
| _number_ | _string_ | _string_ | _string_ | _string_ | _number_      | _Account[]_ | _number_ | _boolean_ |

* **id** : Unique identifier.
* **name** :  User name.
* **cuit** : Tax identification.
* **username** : app username.
* **password** : User app pasword.
* **accountNumber** : Client account number.
* **acounts** : ```Array``` of accounts.
* **isActive** : ```1 or 0``` if user is activated.
* **notified** : if user was notified when signing up.

```typescript
@Entity()
export class User {
  constructor(name, cuit, username, isActive, notified) {
    this.name = name; 
    this.cuit = cuit;
    this.username = username;
    this.isActive = isActive;
    this.notified = notified;
  }

  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column({ length: 500, nullable: true })
  name: string;

  @ApiProperty()
  @Column({ length: 500, nullable: true })
  cuit: string;

  @ApiProperty()
  @Column({ length: 500, unique: true })
  username: string;

  @ApiProperty()
  @Column({ length: 500 })
  password: string;  

  
  @ApiProperty()
  @Column('int', {nullable: true})
  accountNumber: number;

  @ApiProperty({example: Account})
  @ManyToMany(() => Account, (account) => account.users, { cascade: true, eager: false })
  @JoinTable({name: 'user_account'})
  accounts: Account[];

  @ApiProperty()
  @Column()
  isActive: number;

  @Column('bit', {default: false})
  notified: boolean;
}
```


## Funciones de modelo
---

### Accounts

```javascript
adduser()
```
Arreglo de usuario.

Esta funcion _popula_, en caso de requerido, la relacion de la cuenta con distintos usuarios.

```javascript
addUser(aUser: User) {
    if(!Array.isArray(this.users)) {
      this.users = [];
    }
    this.users.push(aUser);
  }
```
---
### Orders
>
```typescript
private static _assertFromOrderIsValid(anOrder)
```
***Inserta correctamente en la orden a generar el periodo requerido para la orden.***

```typescript
private static _assertFromOrderIsValid(anOrder) {
    const {instrument, amount, price, period} = anOrder;

    const availablePeriods = [
      this.PERIOD_CI,
      this.PERIOD_24,
      this.PERIOD_48
    ];

    if(
      !period || (availablePeriods.indexOf(period) < 0)
        || !instrument
        || !amount
        || !price)
      throw new BadRequestException('Order is not valid');
  }
```
---
>
```typescript
static forUserAccountFrom(aUserAccount, anOrder)
```
***Crea una nueva instancia de orden para cada usuario.***

```typescript
static forUserAccountFrom(aUserAccount, anOrder) {
    this._assertFromOrderIsValid(anOrder);
    const {instrument, amount, price, period} = anOrder;

    const instance = new Order();
    instance.instrument = {...instrument};
    instance.ticker = instrument.ticker;
    instance.amount = amount;
    instance.price = price;
    instance.period = period;
    instance.accountNumber = aUserAccount.accountNumber;
    instance.userId = aUserAccount.id;
    return instance;
  }
```
---
>
```typescript
hoursByPeriod()
```
***Establece el periodo requerido para la orden.***

```typescript
hoursByPeriod() {
    switch(this.period) {
      case Order.PERIOD_CI: 
        return 0;
      case Order.PERIOD_24:
        return 24;
      case Order.PERIOD_48:
        return 48;
    }
  }
```
---
>
```typescript
setReminderAt()
```
***Establece el recordatorio de back office para la liquidacion previamente a guardar la nueva orden.***
***Establecido para la actual normativa de la funcionalidad [MEP](/blog/MEP)***


```typescript
@BeforeInsert()
  setReminderAt() {
    const now = new Date();
    now.setHours(11,0,0,0);
    (now).setDate(now.getDate() + (this.hoursByPeriod()/24)+1);
    this.reminderAt = now;
  }
```
---
>
```typescript
buildOrderRequestBody()
```
***Construye el request body para la interaccion con la [ESCO-API](https://api.sistemasesco.com/swagger-ui/documentos/Instructivo_Esco_Api_VisualBolsa_v6.pdf) con los datos de cada instancia de orden.***

```typescript
buildOrderRequestBody(){
    return {
      instrumentoAbreviatura: this.instrument.ticker,
      moneda: this.instrument.currency,
      mercado: this.instrument.market,
      precio: this.price || 0,
      importe: this.amount,
      cuenta: this.accountNumber,
      fechaConcertacion: (new Date()).toISOString(),
      plazo: this.period,
      diasSuscPendiente: 0,
      diasRescPendiente: 0,
      incluyeGastosEnImporte: true,
      variacionPrecio: 0,
      controlaPerfilInversor: false,
      controlaSubyacente: false,
      rutearOrdenAlMercado: false,
      validarOrden: true,
      ordenMarket: true
    }
  }
```
---
### Task
>
```typescript
static with(recipients, subject, text, scheduledDate)
```
Crea instancia para insertar valores validos a la funcion de envio de mail

```typescript
static with(recipients, subject, text, scheduledDate) {
    this._assertValidRecipientsAndScheduleDate(recipients, scheduledDate);
    const instance = new EmailReminder();
    instance.recipients = recipients;
    instance.subject = subject;
    instance.text = text;
    instance.scheduledDate = scheduledDate;
    return instance;
  }
```
---
>
```typescript
private static _assertValidRecipientsAndScheduleDate(recipients: any, scheduledDate: any)
```
Validacion para una correcta insercion de datos y evita errores de valores vacios o incorrectos


```typescript
private static _assertValidRecipientsAndScheduleDate(recipients: any, scheduledDate: any) {
    if(!recipients || recipients == '' || !scheduledDate)
      throw new Error("Method not implemented.");
  }
```