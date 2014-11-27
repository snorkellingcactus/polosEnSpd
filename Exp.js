Exp=function()
{
	//Distintos arrays que permiten referenciar monomios
	//según distintos patrones.
	this.refs={'incogs':[''],'factorP':[]};
	this.subExp=[];

	//Lista de monomios.
	this.monomios=[];
	this.const=0;

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

	for(var i=0;i<mon.incogs.length;i++)
	{
		var incogAct=mon.incogs[i];

		incogAct+=mon[incogAct];

		incogStr+=incogAct;
	}

	return incogStr;
}
Exp.prototype.insMonomio=function(monomio)
{
	var incogStr='';
	if(monomio.incogs.length)
	{
		//Ordeno incognitas por orden alfabético.
		monomio.incogs=monomio.incogs.sort();

		//Formateo un string con las incognitas seguidas por su exponente.
		for(var i=0;i<monomio.incogs.length;i++)
		{
			var incogAct=monomio.incogs[i];

			incogAct+=monomio[incogAct];
			incogStr+=incogAct;

			//Verifico si el monomio tiene a P.
			if(monomio.p)
			{
				this.log.txt('Monomio tiene a incógnita especial P^'+monomio.p);

				//Si P existía en la lista de referencia factorP lo proceso, sino lo agrego.
				if(this.refs.factorP[monomio.p])
				{
					//El monomio preexistente con el mismo exponente de P.
					monFP=this.monomios[this.refs.factorP[monomio.p]];

					//Si no es ya una subexpresion, lo será.
					if(!(monFP instanceof Exp))
					{
						monFP.dIncog('p');

						//El monomio es ahora una expresion con el mismo dentro.
						monFP=new Exp(monFP);

						this.log.fn('new Exp()');
						monFP.log=this.log;
					}
					
					//Agrego el nuevo monomio que también contiene a P.
					monFP.insMonomio(monomio);
					
					monomio.dIncog('p');

					this.log.txt('Variable especial ya definida, factorizando:');
					var str='( ';
					for(var i=0;i<monFP.monomios.length;i++)
					{
						var mon=monFP.monomios[i];

						str+=cohef;

						for(var j=0;j<mon.incogs.length;j++)
						{
							var incog=mon.incogs[j];

							str+=incog+'^';
							str+=mon[incog];
						}

						str+=' + ';
					}
					str=str.substr(0,str.length-1)+' )';

					this.log.txt('Factorizado: '+str);
					//La forma resultante aproximada de las operaciones anteriores es
					//un miembro-expresión que se representaría así:
					//p^y(k1+k2+k3+...)
				}
				else
				{
					this.refs.factorP[monomio.p]=this.monomios.length;

					this.log.txt('Agregada nueva incógnita especial P^'+monomio.p);
				}
			}

			this.log.txt("ID Monomio Insertado: "+incogStr);
		}
		if(this.adMonRef(monomio))
		{
			this.monomios.push(monomio);
		}
	}
	else
	{
		this.log.txt('Eliminado Monomio:');
		this.log.array();
		this.log.array(monomio);
		this.log.array();

		this.const+=monomio.cohef;

		this.log.txt('Nueva Constante: '+this.const);
	}
}
Exp.prototype.nSubExp=function(nExp)
{
	this.subExp.push(nExp);

	return this.subExp.length-1;
}
Exp.prototype.fusiona=function(mon , op)
{
	if(mon instanceof Mon)
	{
		this.fusionaMon(mon , op);
	}
	else
	{
		var tmpExpRef=new Exp();
		tmpExpRef.apila(this);
		tmpExpRef.const=this.const;

		this.fusionaMon(mon.monomios[0] , op)
		


		this.log.txt('Resolviendo primer fusion:');

		this.log.array();
		this.log.array(mon.monomios[0]);
		this.log.array();
		this.log.txt('Fus Op: '+op);
		this.log.array();
		this.log.array(tmpExpRef.monomios);
		this.log.array();
		this.log.txt('Res: '+op);
		this.log.array();
		this.log.array(this.monomios);
		this.log.array();


		for(var i=1;i<mon.monomios.length;i++)
		{
			tmpExp=new Exp();
			tmpExp.apila(tmpExpRef);
			tmpExp.const=tmpExpRef.const;

			this.log.txt('Resolviendo siguiente fusion: ');
			this.log.array();
			this.log.array(tmpExp.monomios);
			this.log.array();

			this.log.txt('Op: '+op);

			this.log.array();
			this.log.array(mon.monomios[i]);
			this.log.array();

			tmpExp.fusionaMon(mon.monomios[i] , op);

			this.log.txt('Resultado:');

			this.log.array();
			this.log.array(tmpExp.monomios);
			this.log.array();

			this.apila(tmpExp);
		}

		this.log.txt('Total:');

		this.log.array();
		this.log.array(this.monomios);
		this.log.array();
	}
	if(mon.const)
	{
		tmpExpRef.fusConst(mon.const , op);

		this.apila(tmpExpRef);
		this.const+=tmpExpRef.const;
	}
}
Exp.prototype.fusionaMon=function(mon , op)
{
	for(var i=0;i<this.monomios.length;i++)
	{
		this.log.txt('Fusionando monomio...');
		log.array();
		log.array(this.monomios[i]);
		log.array();
		log.array();
		log.array(mon);
		log.array();

		this.rmMonRef(this.monomios[i]);

		this.monomios[i]=this.monomios[i].fusiona(mon , op)

		this.adMonRef(this.monomios[i] , i);
	}

	this.fusConstMon(mon , op);
}
Exp.prototype.fusConstMon=function(mon , op)
{
	if(this.const)
	{
		this.log.txt("Nuevo monomio por Const = "+this.const);
		nMon=new Mon();
		nMon.getRefMon(mon);

		nMon.cohef=nMon.opCohef( this.const , nMon.cohef , op);
		if(op===0)
		{
			for(var i=0;i<nMon.incogs.length;i++)
			{
				var nInc=nMon.incogs[i];
				nMon[nInc]*=-1;
			}
		}

		this.const=0;

		this.log.array()
		this.log.array(nMon)
		this.log.array()

		this.insMonomio(nMon);
	}
}
Exp.prototype.fusConst=function(nConst , op)
{
	this.const=Mon.prototype.opCohef
	(
		this.const,
		nConst,
		op
	);

	this.log.txt("Se operará sobre:");
	this.log.array();
	this.log.array(this.monomios);
	this.log.array();

	for(var i=0;i<this.monomios.length;i++)
	{
		this.log.txt("Nuevo monomio por Const = "+nConst);

		this.log.txt("Const =");
		this.log.txt(""+this.monomios[i].cohef);
		this.log.txt("Op: "+op);
		this.log.txt(""+nConst);


		this.monomios[i].cohef=Mon.prototype.opCohef
		(
			this.monomios[i].cohef,
			nConst,
			op
		);


		this.log.txt("Res: ");
		this.log.array();
		this.log.array(this.monomios[i]);
		this.log.array();
	}
}
Exp.prototype.rmMonRef=function(mon)
{
	var monID=this.genMonID(mon);

	this.refs.incogs[monID]=undefined;

	this.refs.incogs=clrArr
	(
		this.refs.incogs
	);
}
Exp.prototype.adMonRef=function(mon , nMon)
{
	var monID=this.genMonID(mon);

	//Si no existía esa clave en el array la creo.
	if(!this.refs.incogs[monID])
	{
		this.refs.incogs[monID]=mon;

		return 1;
	}
	else
	{
		this.log.txt('Ya existe un monomio con '+monID+' :');
		this.log.array();
		this.log.array(this.refs.incogs[monID]);
		this.log.array();

		this.refs.incogs[monID].cohef+=mon.cohef;

		return 0;
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