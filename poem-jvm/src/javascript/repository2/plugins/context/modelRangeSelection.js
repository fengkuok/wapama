/**
 * Copyright (c) 2008
 * Willi Tscheschner
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 **/

// define namespace
if(!Repository) var Repository = {};
if(!Repository.Plugins) Repository.Plugins = {};

/**
 * Supplies filtering by model type (stencil set)
 * Note: Only stencil sets defined in the stencilsets.json can be selected as filter
 */

Repository.Plugins.ModelRangeSelection = {
	
	viewRegion : "view",
	
	construct: function( facade ) {

		// call Plugin super class
		arguments.callee.$.construct.apply(this, arguments); 

	},
	
	render: function( modelData ){

		// Try to removes the old child ...
		if( this.myPanel )
			this.panel.remove( this.myPanel );


		var buttons 	= [];
		var buttonStyle	= "padding:5px;"
				
		var size		= this.facade.getFilteredModels().length;
		var index		= this.facade.getCurrentView().lastStartIndexOfDisplayedModel;
		var pageSize	= this.facade.getCurrentView().numOfDisplayedModels;

		var isFirstPage	= index < pageSize;
		var isLastPage	= index >= size - pageSize;
				
		// Previous
		buttons.push( new Ext.LinkButton({text:"<< Previous Page", click:this._previous.bind(this), style:buttonStyle+"margin-right:15%;", disabled:isFirstPage}) );
		
		// First
		buttons.push( new Ext.LinkButton({text:"First", click:this._setRange.bind(this, 0), style:buttonStyle, disabled:isFirstPage}) );
		
		// Generate Page Buttons
		var firstIndex 	= Math.max( index - (2*pageSize) , 0)
		var startPage	= Math.floor( firstIndex / pageSize );
		var currentPage	= Math.max( Math.floor( index / pageSize ) , 0)
		var endPage		= startPage + 5;
		
		if( startPage != 0 ){
			buttons.push( {xtype:'label', text:'...', style:buttonStyle} )
		}
		
		for( startPage; startPage*pageSize < size && startPage < endPage; startPage++ ){
			var style = currentPage == startPage ? buttonStyle + "font-size:13px;font-weight:bold;color:#000000;": buttonStyle;
			buttons.push( new Ext.LinkButton({text:(startPage+1)+"", click:this._setRange.bind(this, startPage*pageSize), style:style, disabled: currentPage == startPage}) );
		}

		// Checks if the last shown page is realy the last page
		if( !(startPage*pageSize > size-pageSize)){
			buttons.push( {xtype:'label', text:'...', style:buttonStyle} )
		}
				
		// Last
		buttons.push( new Ext.LinkButton({text:"Last", click:this._setRange.bind(this, size - (size % pageSize)), style:buttonStyle, disabled:isLastPage}) );
		// Next
		buttons.push( new Ext.LinkButton({text:"Next Page >>", click:this._next.bind(this), style:buttonStyle+"margin-left:15%;", disabled:isLastPage}) );
		

		this.myPanel = new Ext.Panel({
					style	: 'padding:10px;white-space:nowrap;text-align:center;', 
					border	: false,
					items	: buttons
				})
						
		// ... before the new child gets added		
		this.panel.add( this.myPanel );
		// Update layouting
		this.panel.doLayout();

	},
	
	_previous: function(){
		this.facade.getCurrentView().showPreviousDisplayedModels();
	},
	
	_next: function(){
		this.facade.getCurrentView().showNextDisplayedModels();
	},
	
	_setRange: function( index ){
		this.facade.getCurrentView().showDisplayedModelsStartingFrom( index );
	}		
};

Repository.Plugins.ModelRangeSelection = Repository.Core.ContextPlugin.extend(Repository.Plugins.ModelRangeSelection);