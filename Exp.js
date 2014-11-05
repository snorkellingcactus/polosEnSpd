Exp=function()
{
	//Distintos arrays que permiten referenciar monomios
	//según distintos patrones.
	this.refs={'incogs':[''],'factorP':[]};
	this.incogs=[];

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

			incogAct+=monomio[incogAct];

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

			incogStr+=incogAct;
			log.txt(incogStr);
		}
		//Si no existía esa clave en el array la creo.
		if(!this.refs.incogs[incogStr])
		{
			this.refs.incogs[incogStr]=[];
			
			//Si agrego el ID del monomio a la lista de referencias por incógnitas.
			this.refs.incogs[incogStr].push(this.monomios.length);
			//Agrego el monomio a la expresión.
			this.monomios.push(monomio);
		}
		else
		{
			//Si ya existe un monomio con mismas incognitas a mismos exponentes,
			//multiplico sus coheficientes.
			this.monomios[this.refs.incogs[incogStr]].cohef+=monomio.cohef;
		}
	}
}
Exp.prototype.routh=function()
{
	
}