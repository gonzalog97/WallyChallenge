/*

Requiere instalar por terminal los siguientes elementso:

npm install
npm install cypress --save-dev
se puede pasar a la version mas reciente con el siguiente comando == npm install -D cypress@11.1.0 (opcional) 
npm install -D cypress-xpath 

en la carpeta package.json cambiar donde dice script ==> "test" por "cypress:open": "cypress open"

para correr el test se usa el siguiente comando == npx cypress open

es posible que la primera corrida falle al cargar el dashboard

dentro de la carpeta fixtures debe estar la carpeta DOM y dento de esta el archivo Wally.Page.json 

*/


require('cypress-xpath');
function randomRange(myMin, myMax) {
    return Math.floor(Math.random() * (myMax - myMin + 1) + myMin);
  }
describe("US: User create a new product",()=>{
    beforeEach("",()=>{
        cy.fixture("DOM/Wally.Page").then((the)=>{
            cy.visit(the.login.urlBase)
            cy.xpath(the.login.cookieBtn).click()
        })
    })

    it("TC: Nuevo producto",()=>{
        cy.fixture("DOM/Wally.Page").then((the)=>{
            
            //login
            cy.xpath(the.login.usernameInput).type(the.login.username),
            cy.xpath(the.login.passwordInput).type(the.login.password),
            cy.xpath(the.login.loginBtn).click(),
            cy.wait(10000),
            cy.url().should('include','/Dashboard'),
            cy.xpath(the.login.menuShowBtn).click(),

            //Ingresa a Producto
            cy.contains('Productos').should('be.visible').click(),
            cy.contains('Administrador de productos').should('be.visible').click()
            cy.url().should('include','/Product')
            cy.contains('Nuevo Producto').should('be.visible').click()

            //Ingresa a Nuevo Producto
            cy.contains('Nuevo Producto').should('be.visible').click()
            cy.url().should('include','/Product/New')

            //Modifica los campos

            cy.xpath(the.product.monedaBox).click()
            cy.contains('Dólares').should('be.visible').click()
            cy.xpath(the.product.validaMoneda).contains('$') 
            cy.xpath(the.product.precioUpBtn).click().click()
            cy.xpath(the.product.tipoUnidadBox).click()
            cy.contains('Actual').should('be.visible').click()
            cy.xpath(the.product.impuestosBox).click()
            cy.contains('Exonerado').should('be.visible').click()
            cy.contains('Exonerado').should('be.visible')

            //Selecciona Opciones Avanzadas

            cy.contains('Producto con variantes').click()

            //Completa Variantes del producto

            cy.xpath(the.product.atributoImput).type('4')
            cy.xpath(the.product.valorImput).type('85{enter}')
            cy.contains('85').should('be.visible')
            cy.contains('Agregar').click()

            //Notificacion de Nombre vacio

            cy.contains('Este campo es obligatorio').should('be.visible')
            cy.contains('Por favor, agregue precio, nombre y tipo de unidad').should('be.visible')
            cy.xpath(the.product.nameImput).type('prueba')
            cy.contains('Agregar').click()

            //Seleccion de variantes

            cy.contains('Elige las variantes que deseas añadir').should('be.visible')
            cy.xpath(the.product.varianteCheck).click()
            cy.contains('Se han seleccionado 1 nuevas variantes').should('be.visible')
            cy.get(the.product.varianteBtn).click()
            cy.contains('Pendiente').should('be.visible')

            //Carga de Fotos del producto

            cy.get(the.product.imgSelect).click()
            cy.contains('ZAPATILLAS.jpg').click()
            cy.get(the.product.imgBtn).click()
            cy.contains('Portada').should('be.visible')
            cy.contains('1 foto agregada').should('be.visible')

            //Guarda Nuevo producto

            cy.contains('Guardar').click()

            //Notificacion de código UNSPSC

            cy.contains('No podrás emitir documentos a la sunat si es que no tienes el código UNSPSC').should('be.visible')
            cy.xpath(the.product.unspscBtn).click()

            //Notificacion de Nombre en uso

            cy.contains('El nombre del producto no está disponible').should('be.visible')

            //Cambio de Nombre

            cy.xpath(the.product.nameImput).clear().type('challenge')

            //Guardado de Nuevo producto con Exito

            cy.contains('Guardar').click()
            cy.contains('No podrás emitir documentos a la sunat si es que no tienes el código UNSPSC').should('be.visible')
            cy.xpath(the.product.unspscBtn).click()
            cy.contains('Has creado un producto').should('be.visible')
            cy.get(the.serchBar).type('challenge{enter}').clear()
            cy.contains('challenge').should('be.visible')

        })
    })
    
    it("TCr: Edicion de producto anterior",()=>{
        cy.fixture("DOM/Wally.Page").then((the)=>{

            //login
            cy.xpath(the.login.usernameInput).type(the.login.username)
            cy.xpath(the.login.passwordInput).type(the.login.password)
            cy.xpath(the.login.loginBtn).click()
            cy.wait(10000)
            cy.url().should('include','/Dashboard')

            cy.visit('https://uat.miwally.com/Product') //Manera rapida
            cy.url().should('include','/Product') 

            //Edicion de Nombre de producto creado anteriormente

            cy.get(the.serchBar).type('challenge{enter}')
            cy.contains('challenge').click()
            cy.xpath(the.product.nameImput).clear().type(randomRange(10,90))///Cambiar este numero
            cy.contains('Guardar').click()
            cy.contains('No podrás emitir documentos a la sunat si es que no tienes el código UNSPSC').should('be.visible')
            cy.xpath(the.product.unspscBtn2).click()

            cy.contains('Has guardado los cambios').should('be.visible')


        })
    })
})