function $$(q){
	return document.querySelectorAll(q);
}
function $I(q){
	return document.getElementById(q.substr(1));
}
Object.prototype.$E = 
function (ev,f){
	this.addEventListener(ev,f);
	return this; 
}
function $A(q,a,v){
	var el = $$(q) ;
	e.setAttribute(a,v);
	return e ;
}
function $C(q,a,v){
	var at = [] ;
	var el = $$(q) ;
	Array.prototype.forEach.call(el,function(e){
		if(v) e.style[a] = v ;
		else at.push(e.style[a]) ;		
	})
	return (v)?el:at ;
}