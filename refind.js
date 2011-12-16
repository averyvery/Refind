(function(window, document){

	var _ = {

		/* @group config */

			highlight_class : '_refind_highlight',

			focus_class : '_refind_highlight_focus',

			clickable_elements : [],

			found_elements : [],

		/* @end */
		
		/* @group setup */
			
			init : function(){

				_.createElements();
				_.focus();
				_.bindEvents();
				_.initialized = true;
			
			},

			initOnCorrectKeys : function(event){

				var is_alt_ctrl_f = (
					event.keyCode === 70 && 
					event.ctrlKey && 
					event.altKey
				);

				if(is_alt_ctrl_f){
					_.initialized ? _.focus() : _.init();
				}
			 
			},

			focus : function(){
			
				_.input.focus();

			},
		
			createElements : function(){

				_.wrapper = document.createElement('div');
				_.wrapper.className = '_refind_wrapper';
				_.input = document.createElement('input');
				_.input.className = '_refind_input';
				_.count = document.createElement('p');
				_.count.className = '_refind_count';
				_.clickable_elements = document.getElementsByTagName('a');
				_.wrapper.appendChild(_.input);
				_.wrapper.appendChild(_.count);
				document.body.appendChild(_.wrapper);

			},

			bindEvents : function(){

				_.input.addEventListener('keydown', _.searchOrClick);
			
			},

		/* @end */
		
		/* @group managing events */
		
			searchOrClick : function(event){

				if (event.keyCode === 13) {
					_.click(); 
				} else if (event.keyCode === 9){
					_.cycleElements(); 
					event.preventDefault && event.preventDefault();
					event.stopPropagation && event.stopPropagation();
					event.cancelBubble = true;
					return false;
				} else {
					_.buffer(_.search)
				}
			
			},

			click : function(){

				var selected_elem = _.found_elements[0];
				selected_elem && _.fireEvent(selected_elem, 'click');

			},

			bufferTimer : false,
		
			buffer : function(method){

				clearTimeout(_.timer);
				_.timer = setTimeout(method, 200);
			
			},

			search : function(){

				var text = _.input.value;
				_.clearFoundElements();
				_.findClickableElementsByText(text);
				_.highlightFoundElements();

			},
		
		/* @end */

		/* @group finding dom elements */
		
			findClickableElementsByText : function(text){

				var pattern = new RegExp(text, 'i');

				_.each(_.clickable_elements, function(elem){
					elem.innerHTML.match(pattern) && _.found_elements.push(elem);
				});

			},

			clearFoundElements : function(){
			
				_.each(_.found_elements, function(elem){
					_.removeClass(elem, _.highlight_class);
					_.removeClass(elem, _.focus_class);
				});

				_.found_elements = [];

			},
		
			highlightFoundElements : function(){
			
				_.each(_.found_elements, function(elem){
					_.addClass(elem, _.highlight_class);
				});

				_.found_elements[0] && 
					_.addClass(_.found_elements[0], _.focus_class) &&
					_.scrollTo(_.found_elements[0]);

				_.count.innerHTML = _.found_elements.length + ' results';

			},

			cycleElements : function(){
			
				var first_elem;

				if(_.found_elements[0]){
					_.removeClass(_.found_elements[0], _.focus_class);
					first_elem = _.found_elements.shift();
					_.found_elements.push(first_elem);
					_.addClass(_.found_elements[0], _.focus_class);
					_.scrollTo(_.found_elements[0]);
				}


			},

			scrollTo : function(elem){
			
				var top = _.getPosition(elem) - 100;
				top = (top === NaN || top < 0) ? 0 : top;
				window.console && console.log && console.log(elem);
				window.scrollTo(0, top);

			},

			getPosition : function(elem){

				var curtop = 0;

				if (elem.offsetParent) {
					do {
						curtop += elem.offsetTop;
					} while (elem = elem.offsetParent);
					return [curtop];
				}
			
			},

		/* @end */

		/* @group utility */

			each : function(array, method){

				for(var i = 0, length = array.length; i < length; i++){
					var item = array[i];
					method.call(this, item);
				}
			
			},

			addClass : function(elem, class_name){
			
				elem.className += ' ' + class_name;

			},

			removeClass : function(elem, class_name){
			
				elem.className = elem.className.replace(class_name, ' ');

			},

			// see http://jehiah.cz/a/firing-javascript-events-properly
			fireEvent : function(element, event) {

			 if (document.createEvent) {

				// dispatch for firefox + others
				var evt = document.createEvent('HTMLEvents');
				evt.initEvent(event, true, true);
				return !element.dispatchEvent(evt);

			 } else {

				// dispatch for IE
				var evt = document.createEventObject();
				return element.fireEvent('on' + event, evt)

			 }

			}
			
		
		/* @end */

	};

	window._refind = window._refind || _;

	window.addEventListener('keydown', _.initOnCorrectKeys)

})(window, document);
