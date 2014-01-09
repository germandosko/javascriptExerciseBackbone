var Models = {
	Product: Backbone.Model.extend(),
};

var Collections = {
	Products: Backbone.Collection.extend({
		model: Models.Product,
		url: Etsy.GetQueryUrl(),
		parse: function(resp) {
			for (var i=0;i<resp.results.length;i++){
				resp.results[i].shortTitle = resp.results[i].title.substring(0,17);
				resp.results[i].imageUrl = resp.results[i].Images[0].url_170x135
				resp.results[i].shortDescription = resp.results[i].description.substring(0,55);
			}
			return resp.results;
		}
	}),
};

var Views = {
	SingleProduct: Backbone.View.extend({		
		className: 'product',
		initialize: function(){
			this.template = _.template($('#single_product_template').val());
		},
		render: function(){
			this.$el.html(this.template({product:this.model.toJSON()}));
			return this;
		},
	}),
	
	ProductApp: Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.searchContent = new Views.Search();
			this.searchContent.on('searchRequest', this.performSearch, this);
			this.searchSortContent = new Views.SearchSort();			
			this.collection = new Collections.Products();
			this.collection.on('reset', this.showProducts, this);
			this.performSearch();
		},
		render: function() {
			this.$el.find('#search').append(this.searchContent.render().el);
			this.$el.find('#search').append(this.searchSortContent.render().el);
			this.showProducts();
			return this;
		},
		showProducts: function() {
			this.$el.find('#results').empty();
			var p = null;
			this.collection.each(function(item, idx) {
				p = new Views.SingleProduct({model:item});				
				this.$el.find('#results').append(p.render().el);
			}, this);
			return this;
		},
		performSearch: function(evdata) {
			if(evdata) {Etsy.setKeywords(evdata.queryString)}
			this.collection.fetch();
		},		
	}),

	Search: Backbone.View.extend({
		id: 'search_content',
		events: {
			'click #search_button': 'performSearch',
		},
		initialize: function() {
			this.template = _.template($('#search_product_template').val());
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		},
		performSearch: function(){
			queryString = this.$el.find('#search-text').val();
			this.trigger('searchRequest', {queryString:queryString});
		},
	}),

	SearchSort: Backbone.View.extend({
		id: 'sort_content',
		initialize: function() {
			this.template = _.template($('#search_sort_template').val());
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		},
	}),
};


$(document).ready(function() {
	var pr = new Views.ProductApp();
	pr.setElement($('html')).render();
});
