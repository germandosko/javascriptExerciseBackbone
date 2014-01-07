var Models = {
	Product: Backbone.Model.extend(),
};

var Collections = {
	Products: Backbone.Collection.extend({
		model: Models.Product,
		url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=5ek4vq6nbjpzsyisap0n8woc&includes=Images:1&limit=20&page=1&sort_on=created&sort_order=up&callback=?',
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
			this.collection = new Collections.Products();
			this.collection.on('reset', this.showProducts, this);
			this.performSearch();
		},
		render: function() {
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
			evdata = evdata || {};
			//console.log('VideosApp: entering performSearch - queryString: ' + evdata.queryString);
			this.collection.fetch({data:{q:evdata.queryString}});
			//console.log('VideosApp: leaving performSearch');
		},		
	}),
};


$(document).ready(function() {
	var pr = new Views.ProductApp();
	pr.setElement($('html')).render();
});
