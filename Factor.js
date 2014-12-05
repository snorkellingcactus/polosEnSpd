function esPositivo(num)
{
	if(num<0)
	{
		return -1;
	}
	return 1;
}
FactorOrd=function()
{

	this.factores=[];
	this.estable=1;
	this.estabilizable=1;
	this.rangos=[];

	if(arguments[0])
	{
		this.nFactor(arguments[0]);

		if(arguments[1])
		{
			this.expresion=arguments[1];
			
			this.mkFactores();
		}
	}
}
FactorOrd.prototype.estabilidad=function(signoPrev , k)
{
	if
	(
		this.estabilizable&&
		this.estable&&
		(signoPrev!=esPositivo(k))
	)
	{
		this.estable=0;
	}

	return this.estable;
}
FactorOrd.prototype.nFactor=function(f)
{
	this[f]=[];
	this.factores.push(f);
}
FactorOrd.prototype.mkFactores=function()
{
	for(var i=0;i<this.factores.length;i++)
	{
		log.txt('Factor '+this.factores[i]);
		this.mkFactor(this.factores[i]);
	}
}
FactorOrd.prototype.mkFactor=function(f)
{
	var nInc=f;
	var monIncog=new Mon();
		monIncog.nIncog(nInc);

	//log.enable=false

	if(this.expresion.const)
	{
		this[f][0]=new Exp();
		this[f][0].const=this.expresion.const;
	}
	for(var i=0;i<this.expresion.monomios.length;i++)
	{

		var mon=this.expresion.monomios[i];
		log.txt('Expresion mon');
		log.array();
		log.array(mon);
		log.array();
		var mon=this.expresion.monomios[i];
		var nMon=new Mon();
			nMon.getRefMon(mon);

		if(mon[nInc])
		{
			var expo=mon[nInc];

				monIncog[nInc]=expo;

				nMon=nMon.fusiona(monIncog , 0);

			if(!this[f][expo])
			{
				this[f][expo]=new Exp();
			}
			
			log.txt('Insertando monomio para '+nInc+'^'+expo+' :');

			log.array();
			log.array(nMon);
			log.array();
			this[f][expo].insMonomio(nMon);
		}
		else
		{
			log.txt('Insertando monomio para '+nInc+'^0 :');

			log.array();
			log.array(nMon);
			log.array();

			if(!this[f][0])
			{
				this[f][0]=new Exp();
			}

			this[f][0].insMonomio(nMon);
		}
	}
	for(var j=0;j<this[f].length;j++)
	{
		if(this[f][j])
		{
			log.txt('Factor para '+f+'^'+j+' :');
			log.txt('Constante='+this[f][j].const);
			log.array();
			log.array(this[f][j].monomios);
			log.array();
		}
	}
	//log.enable=false;
}
FactorOrd.prototype.tablaRouth=function(f)
{
	var jMax=Math.ceil(this[f].length/2);
	var tabla=[];
	var signo=0;

	for(i=0;i<this[f].length;i++)
	{
		tabla[i]=[];
		for(j=0;j<jMax;j++)
		{
			var nExp=this[f].length-(2*j)-i-1;

			tabla[i][j]=new Exp();

			if(i<2)
			{
				if(this[f][nExp])
				{
					tabla[i][j]=this[f][nExp];

					if
					(
						!this.estabilidad(1 , tabla[i][j].const)
					)
					{
						this.estabilizable=0;
						this.rangos=false;
					}

					if(!signo)
					{
						signo=esPositivo(tabla[i][j].const);
					}
				}
			}
			else
			{
				if(j<(jMax-1))
				{
					var	nExp=tabla[i-1][0];

					var	nExpB=tabla[i-2][1+j];

					var	nExpE=tabla[i-1][0];

					var	nExpC=tabla[i-2][0];

					var	nExpD=tabla[i-1][1+j];

						log.txt('Expresion:');
						log.fn
						(
							'( ( '+graficaExp(nExp).innerHTML+
							' * '+graficaExp(nExpB).innerHTML+
							' ) - ( '+graficaExp(nExpC).innerHTML+
							'* '+graficaExp(nExpD).innerHTML+
							' ) ) % ( '+graficaExp(nExpE).innerHTML+' )'
						);

						log.txt('ExpD.const = '+nExpD.const+'');
						log.txt('ExpD.mons = '+nExpD.monomios.length+'');

						nExpC=nExpC.mult(nExpD);

						if(nExpC.const || nExpC.monomios.length)
						{
							nExp=nExp.mult(nExpB);

							nExp=nExp.resta(nExpC);

							nExp=nExp.div(nExpE);

						}
						else
						{
							nExp=nExpB;
						}

						tabla[i][j]=nExp;

						log.txt('= '+graficaExp(nExp).innerHTML);
				}
				if
				(
					this.estabilizable&&
					!j&&
					tabla[i][0].monomios.length
				)
				{
					var expresion=tabla[i][0]
					var mon=expresion.monomios[0];
					var val=[0 , Infinity];
					var signo=1;
					var expo=mon[mon.incogs[0]];

					if(esPositivo(expresion.const)===esPositivo(mon.cohef))
					{
						signo=-1;
					}


					val[0]=Math.abs(expresion.const/mon.cohef)*signo;
					if
					(
						(Math.abs(expo)>2)&&
						(expo%2!=0)
					)
					{
						val[0]=(Math.pow
						(
							Math.abs(val[0]),
							1/expo
						)-1e-15)*signo;
					}


					val[1]*=esPositivo(mon.cohef);
					this.rangos.push
					(
						[
							Math.min(val[0] , val[1]),
							Math.max(val[0] , val[1])
						]
					);

					log.txt('Un rango minimo como'+Math.min(val[0] , val[1]));
					log.txt('Un rango máximo como'+Math.max(val[0] , val[1]));
				}
			}

			this.estabilidad(signo , tabla[i][j].const);
			window.console.log(this.estabilizable)
		}
	}
	if(this.rangos.length)
	{
		var min,max;
		min=this.rangos[0][0];
		max=this.rangos[0][1];

		for(var i=1;i<this.rangos.length;i++)
		{
			min=Math.max( min , this.rangos[i][0]);
			max=Math.min( max , this.rangos[i][1]);
		}

		this.rangos=[min , max]
	}
	return tabla;
}