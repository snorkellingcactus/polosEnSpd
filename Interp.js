Interp=function()
{
	//Flags de operaciones en tiempo de interpretación.
	this.expo=false;
	this.mult=false;
	this.res=false;
	this.fn=false;

	//Entorno.
	this.pos=0;
	this.str='';

	this.incog=0;
	this.num=0;
	this.buff='';
	this.monomio={incogs:[],cohef:1};

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
	this.str=this.str.replace( /\s/g , "");
}
//Reseteo las variables.
Interp.prototype.limpia=function()
{
	this.expo=false;
	this.res=false;
	this.fn=false;
	this.incog=0;
	this.num=1;
	this.buff='';
	this.monomio={incogs:[],cohef:1};
}
//Cuando se encuentra una letra que no corresponde a ninguna operación,
//Se toma como incógnita.
Interp.prototype.incogOp=function(letra)
{
	if(!this.monomio[letra])
	{
		//Realizo las posibles operaciones pendientes.
		this.mkMult();
		this.mkExpo();
	
		if(!this.incog)
		{
			this.monomio.cohef=parseFloat(this.buff);
		}
		this.monomio[letra]=1;
		this.monomio.incogs.push(letra);
	
		this.log.txt('Num = '+this.num+' ; Buff= '+this.buff);
		this.log.txt("Se trata de una nueva incógnita");
		this.log.txt("creada nueva incógnita "+letra);
	}

	//Secciono incógnita.
	this.incog=letra;
}
//Cuando se encuentra un número lo almacena en el buffer.
Interp.prototype.numOp=function(num)
{
	this.log.txt("Se encontró un numero. ( "+num+" )");
	this.buff+=num;
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
		case '/':
			this.opDiv();
		break;
		case '(':
			this.opParIni();
		break;
		case ')':
			this.opParFin();
		break;
		case '-':
			this.opMenos(letra);
		break;
		case '+':
			this.opMas(letra);
		break;
		default:
		this.incogOp(letra);
	}
}
//Analiza uno a uno los carácteres del string y realiza las operaciones.
Interp.prototype.interpStr=function(str)
{
	//Creo una expresion si no la hay.
	if(!this.expresion)
	{
		this.expresion=new Exp();
	}

	this.str=str;
	this.clrStr(str);		//Borro espacios y puntos.

	this.log.txt("Comenzando a interpretar cadena");
	this.log.txt("Entrada: "+this.str);

	this.pos=0

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

	//Realizo posibles operaciones pendientes.
	this.mkMult();
	this.mkExpo();
	this.floatBuff();

	//Agrego el monomio a la expresión.
	this.expMonomio(this.monomio);

	this.combina(this.expresion);

	this.log.txt('Constante: '+this.expresion.const);
	this.log.txt('Lista monomios:');
	this.log.array()
	this.log.array(this.expresion.monomios);
	this.log.array();
	this.log.txt('Lista referencias según incógnitas:');
	this.log.array();
	this.log.array(this.expresion.refs.incogs);
	this.log.array();
	this.log.sep();

	return this.expresion;
};
//Convierte a número this.buff y lo almacena en this.num.
Interp.prototype.floatBuff=function()
{
	this.num=parseFloat
	(
		this.buff
	)||1;
}
//Si el monomio es real lo agrega a la expresión.
Interp.prototype.expMonomio=function()
{
	if(this.incog)
	{
		this.expresion.insMonomio(this.monomio);
	}
	else
	{
		//Es una constante, no un monomio.
		log.txt('Buff = '+this.buff+' Num = '+this.num);
		this.expresion.const+=this.num;
		log.txt('El término resultó en una constante '+this.expresion.const);
	}

	this.limpia();
}
//Realiza una multiplicación.
Interp.prototype.mkMult=function()
{
	if(this.mult)
	{
		if(this.incog)
		{
			log.txt('Coheficiente de '+this.incog+' = '+this.monomio.cohef+' X '+this.buff);
			this.monomio.cohef*=parseFloat(this.buff);
			log.txt('Coheficiente de '+this.incog+' es '+this.monomio.cohef);
		}
		else
		{
			this.log.txt('Buff = '+this.buff+' ; Num = '+this.num);
			this.buff=parseFloat(this.buff)*this.num;
			this.log.txt('Una multiplicación resultó '+this.buff);
		}
	}
	this.mult=false;
}
//Realiza una exponenciación.
Interp.prototype.mkExpo=function()
{
	if(this.expo)
	{
		if(this.incog)
		{
			//Le asigno el exponente a la incógnita.
			this.monomio[this.incog]=parseFloat(this.buff);

			this.log.txt("Se determinó el exponente "+this.monomio[this.incog]+" para la incognita "+this.incog);
		}
		else
		{
			//Se está elevando la constante.
			this.buff=Math.pow(this.num , parseFloat(this.buff));

			this.log.txt('Se exponenció una constante, resultando '+this.buff);
		}
	}
	this.expo=false;
}
//Prepara una exponenciación ( ^ );
Interp.prototype.opExpo=function()
{
	this.mkMult();
	this.mkExpo();

	this.floatBuff();
	this.buff='';

	this.expo=true;

	this.log.txt("Se realizará una potenciación");
}
//Prepara una multiplicación ( * );
Interp.prototype.opMult=function()
{
	this.mkMult();
	this.mkExpo();

	this.floatBuff();
	this.buff=''

	this.mult=true;

	this.log.txt("Se realizará una multiplicación");
}
//Prepara una división ( / ).
Interp.prototype.opDiv=function()
{
	this.div=true;
}
//Cuando se abren paréntesis ( ( ).
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
	this.res=true;
}
//Cuando se cierran paréntesis ( ) ).
Interp.prototype.opParFin=function()
{
	if(this.expo&&this.mult)
	{
		this.mkMult();
		this.mkExpo();
		this.monomio[this.incog]=this.num;
		this.log.txt('Se (re)determinó '+this.monomio[this.incog]+' para el exponente.');
	}
	this.res=false;
}
//Cuando se suma ( + ).
Interp.prototype.opMas=function(letra)
{
	//Si se estaba procesando un exponente
	//Lo guardo 
	this.mkExpo();
	this.mkMult();

	if(!(this.expo||this.mult||this.res)&&(this.num||this.buff.length))
	{
		this.log.txt('opMas: Num = '+this.num+' ; Buff = '+this.buff);
		this.log.txt("Insertado monomio:");
		this.log.array();
		this.log.array(this.monomio);
		this.log.array();

		this.floatBuff();
		this.expMonomio(this.monomio);
	}
	else
	{
		this.buff=letra;
	}
}
//Cuando se resta ( - ).
Interp.prototype.opMenos=function(letra)
{
	this.opMas(letra);
	this.buff=letra;
}
Interp.prototype.combina=function(expObj)
{
	/*pila=[];

	for(i=0;i<expObj.refs.incogs.length;i++)
	{
		
	}*/
}
Interp.prototype.routh=function(expObj)
{
	
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