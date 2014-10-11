Interp=function()
{
	//Flags de operaciones en tiempo de interpretación.
	this.expo=false;
	this.mult=false;
	this.res=false;
	this.fn=false;

	//Entorno.
	this.pos=0;
	this.signo=1;
	this.incog=0;
	this.num=1;
	this.buff='';
	this.str='';
	this.monomio={incogs:[]};

	//Objeto de logeo para salidas verbosas.
	this.log=new Log();

	if(arguments.length)
	{
		this.interpStr(arguments[0]);
	}
}
//Función que borra espacios y puntos de un string
//que va a ser interpretado.
Interp.prototype.clrStr=function(str)
{
	this.log.txt("Aplicando RegExp");
	this.str=this.str.replace( /\s|\./g , "");
}
Interp.prototype.limpia=function()
{
	this.expo=false;
	this.res=false;
	this.fn=false;
	this.incog=0;
	this.num=1;
	this.signo=1;
	this.buff='';
	this.monomio={incogs:[]};
}
Interp.prototype.letraDef=function(letra)
{
	if(this.incog)
	{
		if(!this.expo)
		{
			log.txt("Buffer = "+this.buff);
			this.buff=parseFloat(this.buff);
			if(!this.buff && this.buff!==0)
			{
				this.buff=1;
			}
			log.txt("Buffer = "+this.buff);
			
			this.log.txt("Se determino 1 al exponente de "+this.incog);
			this.monomio[this.incog][1]=1;
			this.monomio[this.incog][0]=(this.monomio[this.incog][0]||1)*(this.buff)*this.signo;

			this.buff="";
			this.signo=1;

			this.log.txt("Se determinó "+this.monomio[this.incog][0]+" para el coheficiente de "+this.incog)
		}
	}
	if(!this.monomio[letra])
	{
		//Nueva incógnita.
		this.log.txt("Se trata de una nueva incógnita");

		this.mkMult();

		this.monomio[letra]=[];
		this.monomio[letra][0]=(parseFloat(this.buff)||this.num)*this.signo;
		this.monomio[letra][1]=1;

		this.monomio.incogs.push(letra);

		this.buff="";
		this.signo=1;
		this.log.txt("creada nueva incógnita "+letra);

		log.array();
		log.array(this.monomio[letra],letra);
		log.array();
	}
	this.incog=letra;
}
//Deriva a la función indicada dependiendo de la letra que se encontró.
Interp.prototype.letraOp=function(letra)
{
	this.log.txt("Se encontró una letra. ( "+letra+" )");
	switch(letra)
	{
		case '^':
			this.opExpo();
		break;
		case '*':
			this.opMult();
		break;
		case ',':
			this.opComa();
		break;
		case '(':
			this.opParIni();
		break;
		case ')':
			this.opParFin();
		break;
		case '-':
			this.opMenos();
		break;
		case '+':
			this.opMas();
		break;
		case '':

		break;
		default:
		this.letraDef(letra);
	}
}
Interp.prototype.numOp=function(num)
{
	this.log.txt("Se encontró un numero. ( "+num+" )");
	this.buff+=num;
}
Interp.prototype.interpStr=function(str)
{
	if(!this.expresion)
	{
		this.expresion=new Exp();
	}
	this.log.txt("Convirtiendo monomios en arrays para coleccionarlos:");

	this.str=str;
	//Limpio el texto.
	this.clrStr(str);

	this.log.txt("Entrada: "+this.str);

	//El nuevo monomio.
	monomio={};

	this.pos=0;

	while(this.pos<this.str.length)
	{
		//Decido que se va a hacer con el caracter dependiendo de
		//Si es letra o número.
		if(isNaN(this.str[this.pos]))
		{
			this.letraOp(this.str[this.pos]);
		}
		else
		{
			this.numOp(this.str[this.pos]);
		}

		++this.pos;
	}

	this.mkExpo();

	this.insMonomio(this.monomio);

	this.log.txt('Constante: '+this.expresion.const);
	this.log.txt('Lista monomios:');
	log.array()
	log.array(this.expresion.monomios);
	log.array();
	this.log.txt('Lista referencias según incógnitas:');
	log.array();
	log.array(this.expresion.refs.incogs);
	log.array();
	log.sep();
	return this.expresion;
};
Interp.prototype.floatBuff=function()
{
	this.num=parseFloat
	(
		this.buff
	)||1;
}
Interp.prototype.insMonomio=function()
{
	if(this.incog)
	{
		this.expresion.insMonomio(this.monomio);
	}
	else
	{
		//Es una constante, no un monomio.
		log.txt('El término resultó en una constante '+this.buff);
		this.expresion.const+=parseFloat(this.buff)*this.signo;
		log.txt('Suma total de constantes: '+this.expresion.const);
	}
	this.limpia();
}
Interp.prototype.mkMult=function()
{
	if(this.mult)
	{
		this.num=parseFloat(this.buff)*this.num;

		this.log.txt('Una multiplicación resultó '+this.num);
		this.buff=this.num;
		this.mult=false;
	}
}
Interp.prototype.mkExpo=function()
{
	if(this.expo)
	{
		if(!this.incog)
		{
			//Se está elevando la constante.
			log.txt("Buffer"+this.expresion.const);
			this.buff=Math.pow(this.num , parseFloat(this.buff)*this.signo);
			this.log.txt('Se exponenció una constante, resultando '+this.expresion.const);
		}
		else
		{
			//Le asigno el exponente a la incógnita.
			this.monomio[this.incog][1]=parseFloat(this.buff)*this.signo;
			this.log.txt("Se determinó el exponente "+this.monomio[this.incog][1]+" para la incognita "+this.incog);
		}
	}
	this.expo=false;
}
//Cuando se indica una exponenciación (^);
Interp.prototype.opExpo=function()
{
	this.mkMult();

	this.floatBuff();
	this.buff="";

	this.expo=true;

	this.log.txt("Se realizará una potenciación");
}
//Cuando se indica una multiplicación (^);
Interp.prototype.opMult=function()
{
	this.mkMult();
	this.floatBuff();
	this.buff=""
	this.mult=true;

	this.log.txt("Se realizará una multiplicación");
}
Interp.prototype.opComa=function()
{
	this.buff+=".";

	this.log.txt("Es una coma");
}
Interp.prototype.opParIni=function()
{
	if(!this.expo)
	{
		var posFin=str.substr(this.pos).indexOf(")")+this.pos;
		var incog=this.incog+str.substr(this.pos,posFin);
		if(!fns[incog])
		{
			incog+=str.substr
			(
				this.pos,
				posFin
			);
			this.pos+=posFin;
		}
	}
}
Interp.prototype.opParFin=function()
{
	if(this.expo&&this.mult)
	{
		this.expo=false;
		this.mkMult();
		this.monomio[this.incog][1]=this.num;
		this.log.txt('Se (re)determinó '+this.monomio[this.incog][1]+' para el exponente.');
	}
}
Interp.prototype.opMas=function()
{
	//Si se estaba procesando un exponente
	//Lo guardo 
	if(this.expo&&this.buff.length)
	{
		this.mkExpo();
	}
	if(!(this.expo||this.mult||this.res))
	{
		this.insMonomio(this.monomio);

		this.log.txt("Insertado monomio:");
		this.log.array();
		this.log.array(this.monomio);
		this.log.array();
	}
}
Interp.prototype.opMenos=function()
{
	this.opMas();
	this.signo=-1;
}

//Ordena array de monomios por los exponentes de cada uno.
function reordenaCohef(polArr)
{
	var cohefs=[];		//Lista de coheficientes.
	var refPolIncogs=[];		//Para referenciar a los polinomios según su cantidad de incógnitas.
	var refPolCohef=[];	//Para referenciar a los polinomios según su exponente.
	var ordenado=[];	//Resultado ordenado segun exponentes.
	
	this.log.txt('Entrada:');
	log.array();
	log.array(polArr);
	log.array();
	this.log.txt("Creando lista de coheficientes:");
	for(var i=0;i<polArr.length;i++)
	{
		//Agrego el polinomio en refPolIncogs según su cantidad
		//De incógnitas.
		nIncogsAct=polArr.incogs.length;
		if(!refPolIncogs[nIncogsAct])
		{
			refPolIncogs[nIncogsAct]=[];
		}
		refPolIncogs[nIncogsAct].push(polArr[i]);
	};
	return 0;
	/*
	for(var clave as refPolIncogs)
	{
		var polsIncogAct=refPolIncogs[clave];	//Lista de polinomios actual.

		for(var j=0;j<refPolIncogs[clave].length;j++)
		{
			var polAct=polsIncogAct[j];		//Polinomio actual.
			var grupoIncogs={};				//Lista de nombres de incógnitas con su exponente como valor.
			var agrupable=1;			//Por defecto es agrupable
			
			for(var k=1;k<parseInt(clave);k++)
			{
				var incogAct=polAct.incogs[k];		//Obtengo nombre de incognita.
				var expoAct=polAct[incogAct][1];	//Obtengo exponente.

				if(!incogs[incogAct]);
				{
					//Si no existía la creo.
					incogs[incogAct]=expoAct;
				}
				else
				{
					
				}
				if(refPolIncogs[clave][j].incogs[k])
			}
		}
		cohefs[i]=polArr[i][clave][1];			//Voy creando la lista de coheficientes.
		refPolCohef[polArr[i][clave][2]]=polArr[i];	//Y asocio el coheficiente con el monomio correspondiente.
	}
	log.array();
	log.array(cohefs);
	log.array();
	return 0;
	//Ordeno la lista de coheficientes.
	cohefs=cohefs.sort
	(
		function(a,b)
		{
			return a-b
		}
	);
	this.log.txt("Ordenada lista de coheficientes:");
	this.log.txt("Ordenando polinomio según lista de coheficientes:");
	log.array();
	//Ordeno el polinomio segun la lista de coheficientes.
	for(var j=0;j<polArr.length;j++)
	{
		ordenado[j]=refPolCohef[cohefs[j]];
		
		log.array(ordenado[j]);
	};
	log.array();
	return ordenado;*/
};
//Suma los que tienen igual exponente.
function combinaIgualExp(polOrdenado)
{
	var exponentes,polCombinado;

	exponentes=[];
	polCombinado=[];

	for(var j=0;j<polOrdenado.length;j++)
	{
		var expoAct=polOrdenado[j][2];
		
		log.array();
		log.array(polOrdenado[j]);
		log.array();
		if(!exponentes[expoAct])
		{
			polCombinado.push(polOrdenado[j]);				//Voy coleccionando los polinomios en un array.
			exponentes[expoAct]=polCombinado[polCombinado.length-1];	//Dejo en claro que el exponente está siendo usado.

			this.log.txt("Guardado exponente en lista");
		}
		else
		{
			this.log.txt
			("El exponente "+expoAct+" ya está en la lista , se suman los coheficientes "+exponentes[expoAct][0]+" + "+polOrdenado[j][0]+" = "+exponentes[expoAct][0]+polOrdenado[j][0]
			);
			exponentes[expoAct][0]+=polOrdenado[j][0];			//Como hay un polinomio usando este exponente, sumo los coheficientes.
		}
	}

	return polCombinado
}
//Completa el polinomio en caso de que le falten monomios.
function completaPolArr(polArr)
{
	var nPolArr=[];
	
	for(var i=0;i<polArr.length;i++)
	{
		var expo=polArr[i][2];
		var cohef=polArr[i][1];

		if(i<expo)
		{
			for(var j=i;j<expo;j++)
			{
				nPolArr[i+j]=[0,cohef,i+j];
			}
		}
// 		
		nPolArr[expo]=polArr[i];
	}

	return	nPolArr
};
//Si es positivo retorna true, sino false.
function esPositivo(num)
{
	if(num<0)
	{
		return false;
	}
	else
	{
		return	true;
	}
};
//Retorna la cantidad de polos en SPD.
function verifSignoCohef(polArr)
{
	var signo=esPositivo(polArr[0][0]);
	var cantidad=0;
	
	for(var i=0;i<polArr.length;i++)
	{
		if(esPositivo(polArr[i][0])!=signo)
		{
			signo=!signo;
			cantidad++;
		}
	}

	return cantidad;
};

interp=new Interp();
log=interp.log;

function procesaPol(txt)
{
	interp.interpStr(txt);
	//proc=reordenaCohef(proc);
	log.sep();
	//pol=combinaIgualExp(pol);
	return 0;
	//return completaPolArr(proc);
}
function outinput()
{
	document.getElementsByName("res")[0].innerHTML=""
	log.buff="";

	var pol=procesaPol(document.getElementsByName("pol")[0].value);
	log.sep();
	log.fn("Respuesta:");
	
	for(var j=0;j<pol.length;j++)
	{
		log.array()
		if(pol[j])
		{
			for(var i=0;i<pol[j].length;i++)
			{
				log.array(pol[j][i]);
			}
		}
		else
		{
			log.array("Indefinido");
		};
		log.array();
	};
	document.getElementsByName("res")[0].innerHTML=log.buff;
}
function verifEstado(polArr){};