Exp=function()
{
	//Distintos arrays que permiten referenciar monomios
	//según distintos patrones.
	this.refs={'incogs':['']};

	//Lista de monomios.
	this.monomios=[];
	this.const=0;

	if(arguments.length)
	{
		this.interpStr(arguments[0]);
	}
}
Exp.prototype.interpStr=function(str)
{
	var interp=new Interp(this);

	return interp.interpStr(str);
}
Exp.prototype.insMonomio=function(monomio)
{
	var incogStr='';
	if(monomio.incogs)
	{
		//Ordeno incognitas por orden alfabético.
		monomio.incogs=monomio.incogs.sort();

		//Formateo un string con las incognitas seguidas por su exponente.
		for(var i=0;i<monomio.incogs.length;i++)
		{
			var incogAct=monomio.incogs[i];
			incogStr+=incogAct;
			incogStr+=monomio[incogAct][1];
		}
		//Si no existía esa clave en el array la creo.
		if(!this.refs.incogs[incogStr])
		{
			this.refs.incogs[incogStr]=[];
		}
		//Si agrego el ID del monomio a la lista de referencias por incógnitas.
		this.refs.incogs[incogStr].push(this.monomios.length);
		//Agrego el monomio a la expresión.
		this.monomios.push(monomio);
	}
}