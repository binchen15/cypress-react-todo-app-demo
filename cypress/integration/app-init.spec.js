const todos = [
	{
		"id": 1,
	  "name": 'Buy Milk',
	  "isComplete": false
	},
	{
		"id": 2,
	  "name": 'Buy Eggs',
	  "isComplete": false
	},
	{
		"id": 3,
	  "name": 'Buy Bread',
	  "isComplete": false
	},
	{
		"id": 4,
	  "name": 'Make French Toast',
	  "isComplete": false
	}
]

describe('App initialization', ()=>{
	it.only('loads todos on page load', ()=>{
		cy.seedAndVisit()
		//cy.server()
		//cy.route('GET', '/api/todos', 'fixture:todos')
		//cy.visit('http://localhost:3030')
		cy.get('.todo-list li')
			.should('have.length', 4)

	})

	it.only('Displays an error on failure', ()=>{

		cy.server()
		cy.route({
			url: '/api/todos',
			method: 'GET',
			status: 500,
			response: {}
		})
		cy.visit("http://localhost:3030")

		cy.get('.todo-list li')
			.should('not.exist')

		cy.get('.error')
			.should('be.visible')

	})

})
