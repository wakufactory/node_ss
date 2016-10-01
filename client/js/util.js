function $$(q){
	return document.querySelectorAll(q);
}
function $I(q){
	return document.getElementById(q);
}
function $E(e,ev,f){
	e.addEventListener(ev,f);
	return e; 
}
function $A(e,a,v){
	var at = [] ;
	var el = e ;
	if(!el.length) el = [el] ;
	Array.prototype.forEach.call(el,function(e){
		if(v!=undefined) e.setAttribute(a,v);
		else at.push(e.getAttribute(a)) ;		
	})
	return (at.length)?at:e ;
}
function $C(e,a,v){
	var at = [] ;
	var el = e ;
	if(!el.length) el = [el] ;
	Array.prototype.forEach.call(el,function(e){
		if(v!=undefined) e.style[a] = v ;
		else at.push(e.style[a]) ;		
	})
	return (at.length)?at:e ;
}