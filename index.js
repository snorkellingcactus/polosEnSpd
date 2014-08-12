//Salida:
log=new Log();
//Formatea un polinomio escrito para que pueda ser procesado por las funciones (borra espacios y puntos).
function clrStrPol(strPol)
{
	log.txt("Aplicando RegExp");
	return strPol.replace( /\s|\./g , "");
}
//Convierte una cadena con un termino en un array con coheficiente, incógnitas y exponente [0,1,2].
function strMonArr(strMon)
{

	log.txt("Entrada:"+strMon);
	var incogs={};
	var modoExpo=false;
	var modoMult=false;
	var resuelve=false;
	var modoFn=false;

	var incogAct=0;
	var j=0;
	var numBuff="";
	var num=0;

	log.txt("Analizando Monomio...");
	while(j<strMon.length)
	{
		if(isNaN(strMon[j]))
		{
			log.txt("Se encontró una letra. ( "+strMon[j]+" )");
			switch(strMon[j])
			{
				case "^":
				num=parseFloat(numBuff)||1;
				numBuff="";
				modoExpo=true;
				log.txt("Se realizará una potenciación");
				break;
				case "*":
				num=parseFloat(numBuff)||1;
				numBuff="";
				modoMult=true;
				log.txt("Se realizará una multiplicación");
				break;
				case ",":
				numBuff+=".";
				log.txt("Es una coma");
				break;
				case "(":
				j=strMon.indexOf(")");
				break;
				default:
				if(incogAct)
				{
					if(!modoExpo)
					{
						log.txt("Se determino 1 al exponente de "+incogAct);
						incogs[incogAct][1]=1;
						incogs[incogAct][0]=(incogs[incogAct][0]||1)*(parseFloat(numBuff));
						log.txt("Se determinó "+incogs[incogAct][0]+" para el coheficiente de "+incogAct)
						numBuff="";
					}
				}
				else
				{
					//Nueva incógnita.
					log.txt("Se trata de una nueva incógnita");
					if(modoMult)
					{
						var tmp=num;
						num=tmp*(parseFloat(numBuff)||1);
						numBuff="";
						modoMult=false;
					}
				}
				if(!incogs[strMon[j]])
				{
					incogs[strMon[j]]=[];
					incogs[strMon[j]][0]=(parseFloat(numBuff)||1);
					incogs[strMon[j]][1]=1;
					numBuff="";
					log.txt("creada nueva incógnita "+strMon[j]);
					log.array();
					log.array(incogs[strMon[j]],strMon[j]);
					log.array();
				}
				incogAct=strMon[j];
			};
		}
		else
		{
			log.txt("Se encontró un numero. ( "+strMon[j]+" )");
			numBuff+=strMon[j];
			if(modoExpo&&modoMult)
			{
				log.txt("Error, exponenciando y multiplicando a la vez");
			}
		}
		j++;
	}
	
	log.array()
	log.array(incogs);
	log.array();
	log.sep();
	return incogs;
	//return res;
};
//Convierte una cadena preprocesada por clrStrPol en un array con monomios
function strPolArr(strPol)
{
	log.txt("Separando monomios:");

	var splPol=strPol.split(/\+|\-/g);
	var polArr=[];

	return splPol;
}
//Ordena array de monomios por los exponentes de cada uno.
function reordenaCohef(polArr)
{
	var cohefs=[];
	var refPolCohef=[];
	var ordenado=[];
	
	for(var i=0;i<polArr.length;i++)
	{
		cohefs[i]=polArr[i][2];
		refPolCohef[polArr[i][2]]=polArr[i];
	};
	cohefs=cohefs.sort
	(
		function(a,b)
		{
			return a-b
		}
	);
	
	log.array();
	for(var j=0;j<polArr.length;j++)
	{
		ordenado[j]=refPolCohef[cohefs[j]];
		
		log.array(ordenado[j]);
	};
	log.array();
	return ordenado;
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

			log.txt("Guardado exponente en lista");
		}
		else
		{
			log.txt
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

function procesaPol(txt)
{
	var pol,proc;
	
	log.sep();
	log.fn("clrStrPol()");

	proc=clrStrPol(txt);

	log.txt(proc);
	log.sep();
	log.fn("strPolArr()");

	proc=strPolArr(proc);
	
	log.array();
	log.array(proc);
	log.array();

	log.sep();
	log.txt("Convirtiendo monomios en arrays para coleccionarlos:");
	pol=[];
	for(var j=0;j<proc.length;j++)
	{
		pol[j]=strMonArr(proc[j]);
	}
	return 0;
	log.sep();
	log.fn("reordenaCohef()");

	pol=reordenaCohef(pol);
	//pol=combinaIgualExp(pol);
	
	return completaPolArr(pol);
}
function outinput()
{
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