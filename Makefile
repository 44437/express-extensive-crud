postman-doc:
	postman-to-markdown express-extensive-crud.postman_collection.json
combine-mds:
	cat express-extensive-crud.md >> README.md
