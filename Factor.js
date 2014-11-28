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

	if(this.expresion.const)
	{
		this[f][0]=new Exp();
		this[f][0].const=this.expresion.const;
	}
	for(var i=0;i<this.expresion.monomios.length;i++)
	{
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
			
			this[f][expo].insMonomio(nMon);
		}
		else
		{
			if(!this[f][0])
			{
				this[f][0]=new Exp();
			}

			this[f][0].insMonomio(nMon);
		}
	}

	/*
	log.enable=false;
	for(var j=0;j<this[f].length;j++)
	{
		if(this[f][j])
		{
			log.txt('Factor para '+f+'^'+j+' :');
			log.array();
			log.array('Constante='+this[f][j].const);
			log.array(this[f][j].monomios);
			log.array();
		}
	}*/
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
					var nExp=new Exp();
						nExp.apila(tabla[i-1][0]);
						nExp.const=tabla[i-1][0].const;

					var nExpE=new Exp();
						nExpE.apila(tabla[i-1][0]);
						nExpE.const=tabla[i-1][0].const;

					var nExpB=new Exp();
						nExpB.apila(tabla[i-2][1+j]);
						nExpB.const=tabla[i-2][1+j].const;

					var nExpC=new Exp();
						nExpC.apila(tabla[i-2][0]);
						nExpC.const=tabla[i-2][0].const;

					var nExpD=new Exp();
						nExpD.apila(tabla[i-1][1+j]);
						nExpD.const=tabla[i-1][1+j].const;

						nExp.mult(nExpB);
						nExpC.mult(nExpD);

						nExp.resta(nExpC);

						nExp.div(nExpE);

						tabla[i][j]=nExp;
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