Exp=function()
{
	//Distintos arrays que permiten referenciar monomios
	//según distintos patrones.
	this.refs={'incogs':{},'factorP':[]};
	this.subExp=[];

	//Lista de monomios.
	this.monomios=[];
	this.const=0;
	this.num=false;

	if(arguments.length)
	{
		this.interpStr(arguments[0]);
	}

	this.log=new Log();
}
Exp.prototype.interpStr=function(str)
{
	var interp=new Interp(this);

	return interp.interpStr(str);
}
Exp.prototype.genMonID=function(mon)
{
	var incogStr='';

	if(!mon.incogs)
	{
		return incogStr;
	}
	//Ordeno incognitas por orden alfabético.
	mon.incogs=mon.incogs.sort();

	for(var i=0;i<mon.incogs.length;i++)
	{
		var incogAct=mon.incogs[i];

		incogAct+=mon[incogAct];

		incogStr+=incogAct;
	}

	return incogStr;
}
Exp.prototype.rmMonRef=function(mon)
{
	var monID;

	if(mon instanceof Mon)
	{
		monID=this.genMonID(mon);
	}
	else
	{
		monID=mon;
	}

	log.txt('Removiendo referencia '+monID);
	this.refs.incogs[monID]=undefined;

	this.refs.incogs=clrArr(this.refs.incogs);
}
Exp.prototype.adMonRef=function(mon)
{
	var monID=this.genMonID(mon);

	log.txt('Ceando referencia '+monID);
	//Si no existía esa clave en el array la creo.
	if(!this.refs.incogs[monID])
	{
		this.refs.incogs[monID]=mon;

		return 1;
	}
	else
	{
		log.txt('Ya existe un monomio con '+monID+' :');
		log.array();
		log.array(this.refs.incogs[monID]);
		log.array();
		log.array();
		log.array(this.monomios);
		log.array();

		this.refs.incogs[monID].cohef+=mon.cohef;

		return 0;
	}
}
Exp.prototype.delMonomio=function(nMon)
{
	this.monomios[nMon]=undefined;
}
Exp.prototype.insMonomio=function(monomio)
{
	log.txt('Insertando monomio...');
	log.array();
	log.array(monomio);
	log.array();
	if(monomio.incogs.length)
	{
		log.txt('Creando referencia');
		if(this.adMonRef(monomio))
		{
			this.monomios.push(monomio);
		}
	}
	else
	{
		log.txt('Eliminado Monomio');

		this.const+=monomio.cohef;

		log.txt('Nueva Constante: '+this.const);
	}
}
Exp.prototype.nSubExp=function(nExp)
{
	this.subExp.push(nExp);

	return this.subExp.length-1;
}
Exp.prototype.fusiona=function(mon , op)
{
	nExp=new Exp();

	if(mon instanceof Mon)
	{
		this.fusionaMon(mon , op , nExp);
	}
	else
	{
		if(op===0 &&(mon.monomios.length>1||(mon.monomios.length&&mon.const!==0)))
		{
			mon.num=this;
			log.txt('Evitando division de varios denominadores');
			log.array();
			log.array(mon);
			log.array();
			//No se puede hacer distributiva de un 
			//numerador con varios denominadores.


			return mon;
		}
		if(mon.monomios.length)
		{
			log.txt('Multiplicando:')
			log.array();
			log.array(this.monomios);
			log.array();

			for(var i=0;i<mon.monomios.length;i++)
			{

				log.txt('Resolviendo siguiente fusion: ');
				log.array();
				log.array(this.monomios);
				log.array();

				log.txt('Op: '+op);

				log.array();
				log.array(mon.monomios[i]);
				log.array();

				this.fusionaMon(mon.monomios[i] , op , nExp);
			}

			log.txt('Total:');

			log.array();
			log.array(nExp.monomios);
			log.array();

			log.txt('Multiplicando:')
			log.array();
			log.array(this.monomios);
			log.array();
		}
		if(mon.const)
		{
			this.fusConst(mon.const , op , nExp);
		}
	}

	return nExp;
}
Exp.prototype.fusionaMon=function(mon , op , nExp)
{
	var iMax=this.monomios.length;

	for(var i=0;i<iMax;i++)
	{
		log.txt('Fusionando monomio...');
		log.array();
		log.array(this.monomios[i]);
		log.array();
		log.array();
		log.array(mon);
		log.array();

		var monID=this.genMonID(this.monomios[i]);

		nMon=new Mon();
		nMon.getRefMon(this.monomios[i]);
		nMon=nMon.fusiona(mon , op);

		nExp.insMonomio(nMon);
	}

	if(this.const)
	{
		nExp.insMonomio(this.fusConstMon(mon , op));
	}
}
Exp.prototype.fusConstMon=function(mon , op)
{
	log.txt("Nuevo monomio por const = "+this.const);
	nMon=new Mon();
	nMon.getRefMon(mon);

	nMon.cohef=nMon.opCohef( this.const , nMon.cohef , op);
	if(op===0)
	{
		nMon.inversa();
	}

	log.array()
	log.array(nMon)
	log.array()

	return nMon;
}
Exp.prototype.fusConst=function(nConst , op , nExp)
{
	nExp.const=Mon.prototype.opCohef
	(
		this.const,
		nConst,
		op
	);

	log.txt("Se operará sobre:");
	log.array();
	log.array(this.monomios);
	log.array();

	for(var i=0;i<this.monomios.length;i++)
	{
		nMon=new Mon();
		nMon.getRefMon(this.monomios[i]);

		log.txt("Nuevo monomio por Const = "+nConst);

		log.txt("Const =");
		log.txt(""+this.monomios[i].cohef);
		log.txt("Op: "+op);
		log.txt(""+nConst);


		nMon.cohef=Mon.prototype.opCohef
		(
			this.monomios[i].cohef,
			nConst,
			op
		);

		nExp.insMonomio(nMon);
		log.txt("Res: ");
		log.array();
		log.array(nMon);
		log.array();
	}
	return nExp;
}
Exp.prototype.inversa=function()
{
	for(var i=0;i<this.monomios.length;i++)
	{
		this.monomios[i].inversa();
	}

	if(this.const)
	{
		this.const=1/this.const;
	}
}
Exp.prototype.apila=function(mon)
{
	if(mon instanceof Mon)
	{
		this.apilaMon(mon);
	}
	else
	{
		this.apilaExpMon(mon);
	}
}
Exp.prototype.apilaMon=function(aMon)
{
	nMon=new Mon();


	nMon.getRefMon(aMon);

	this.insMonomio(nMon);
}
Exp.prototype.apilaExpMon=function(aExp)
{
	for(var i=0;i<aExp.monomios.length;i++)
	{
		this.apilaMon(aExp.monomios[i]);
	}
}
Exp.prototype.routh=function()
{
	
}
Exp.prototype.esK=function()
{
	return !this.monomios.length
}
Exp.prototype.div=function(div)
{
	this.loginIni(this,div,'%');
	//log.enable=false;
	//log.enable=false;

	interp=new Interp()
	interp.num=this;
	interp.buff=div;
	interp.div=1;
	interp.mkDiv();


	interp.buff.login();

	return interp.buff;
}
Exp.prototype.suma=function(suma)
{
	this.loginIni(this,suma,'+');

	//log.enable=false;

	this.apila(suma)
	this.const+=suma.const;

	//log.enable=false;

	this.login();

	return this;
}
Exp.prototype.resta=function(resta)
{
	var nExp=new Exp();

	nExp.suma(resta);


	//log.enable=false;
	log.txt('Resta:');
	for(var i=0;i<nExp.monomios.length;i++)
	{
		nExp.monomios[i].cohef*=-1;
	}
	nExp.const*=-1;

	this.loginIni(this,nExp , '-');

	this.suma(nExp);

	this.login();
	//log.enable=false;

	return this;
}
Exp.prototype.mult=function(mult)
{
	this.loginIni(this,mult,'X');
	//log.enable=false;

	interp=new Interp()
	interp.num=this;
	interp.buff=mult;
	interp.mult=1;
	interp.mkMult();

	//log.enable=false;

	interp.buff.login();

	return interp.buff;
}
Exp.prototype.login=function()
{
	log.txt('Constante: '+this.const);
	log.array();
	log.array(this.monomios);
	log.array();
}
Exp.prototype.loginIni=function(A,B,op)
{
	log.sep();
	log.txt('Constante: '+A.const);
	log.array();
	log.array(A.monomios);
	log.array();
	log.txt(op);
	log.txt('Constante: '+B.const);
	log.array();
	log.array(B.monomios);
	log.array();
 }
 Exp.prototype.calcBode=function(inc,val)
 {
 	var res=0;

 	for(var i=0;i<this.monomios.length;i++)
 	{
 		var monAct=this.monomios[i];

 		

 		res+=Math.log10(monAct.cohef*val)*(monAct[inc]||1);
 	}

 	if(this.const)
 	{
 		res+=Math.log10(this.const);
 	}

 	return res;
 }