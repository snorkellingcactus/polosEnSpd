function clrArr(arr)
{
	nArr={};
	for(clave in arr)
	{
		if(arr[clave])
		{
			nArr[clave]=arr[clave];
		}
	}

	return nArr;
}
function clrLst(arr)
{
	var nArr=[];
	for(var i=0;i<arr.length;i++)
	{
		if(arr[i])
		{
			nArr.push(arr[i]);
		}
	}

	return nArr;
}
Mon=function()
{
	this.cohef=1;
	this.incogs=[];
}
//Elimina la incógnita del nombre pasado por parámetro del monomio.
Mon.prototype.dIncog=function(nIncog)
{
	for(var j=0;j<this.incogs.length;j++)
	{
		if(this.incogs[j]==nIncog)
		{
			this[this.incogs[j]]=undefined;
			this.incogs[j]=undefined;

			break;
		}
	}
}
Mon.prototype.fusiona=function(mon , op)
{
	log.txt("Mon.cohef= "+this.cohef+" ; nMon.cohef= "+mon.cohef);

	this.cohef=this.opCohef(this.cohef , mon.cohef , op);

	log.txt("Resultado: "+this.cohef);

	for(var i=0;i<mon.incogs.length;i++)
	{
		var nIncNom=mon.incogs[i];

		log.txt('Procesando '+nIncNom);

		if(!this[nIncNom])
		{
			this.nIncog(nIncNom);
		}

		log.txt("Exponente "+nIncNom+" = "+this[nIncNom]+" | "+mon[nIncNom]);
		this[nIncNom]=this.opExpo(this[nIncNom] , mon[nIncNom] , op);
		log.txt("Resultado: "+this[nIncNom]);

		if(!this[nIncNom])
		{
			this.dIncog(nIncNom);
		}
	}
	var nMon=new Mon();

	nMon.getRefMon(this);

	return nMon;
}
Mon.prototype.opExpo=function(expA,expB,op)
{
	switch(op)
	{
		//Dividiendo.
		case 0 :
			return expA-expB;
		break;
		//Exponenciando.
		case 1 :
			return expA*expB;
		break;
		//Radicando.
		case 2 :
			return expA/expB;
		break;
		//Multiplicando.
		default:
			return expA+expB;
	}
}
Mon.prototype.opCohef=function(expA,expB,op)
{
	switch(op)
	{
		//Dividiendo.
		case 0 :
			return expA/expB;
		break;
		//Exponenciando.
		case 1 :
			return expA^expB;
		break;
		//Radicando.
		case 2 :
			return expA^(1/expB);
		break;
		//Multiplicando.
		default:
			return expA*expB;
	}
}
Mon.prototype.getRefMon=function(rMon)
{	
	for(var i=0;i<rMon.incogs.length;i++)
	{
		log.txt('mon.incogs['+i+']='+rMon.incogs[i]+'');
		if(rMon.incogs[i]!==undefined&&rMon[rMon.incogs[i]]!==undefined)
		{
			var nInc=rMon.incogs[i];

			this.nIncog(nInc);

			this[nInc]=rMon[nInc];
		}
	}

	this.cohef=rMon.cohef;
}
Mon.prototype.inversa=function()
{
	for(var i=0;i<this.incogs.length;i++)
	{
		this[this.incogs[i]]*=-1;
		this.cohef=1/this.cohef;
	}
}
Mon.prototype.fusDiv=function(){}
Mon.prototype.nIncog=function(incNom)
{
	this.incogs.push(incNom);
	this[incNom]=0;
}