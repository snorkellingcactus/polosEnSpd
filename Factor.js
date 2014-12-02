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

	log.enable=true

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
	
	log.enable=true;
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
						if(nExpD.const || nExpD.monomios.length)
						{
							nExp=nExp.mult(nExpB);

							nExpC=nExpC.mult(nExpD);

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
			}
			if(this.estable&&(signo!=esPositivo(tabla[i][j].const)))
			{
				this.estable=0;
			}
		}
	}

	return tabla;
}