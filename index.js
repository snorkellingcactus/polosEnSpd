//Formatea un polinomio escrito para que pueda ser procesado por las funciones (borra espacios y puntos).
function clrStrPol(strPol)
{
	return strPol.replace( /\s|\./g , "");
}
//Convierte una cadena con un monomio en un array con coheficiente, incógnita y exponente [0,1,2].
function strMonArr(strMon)
{
	var res=
	[
		parseFloat(strMon[0]), 
		strMon[1], 
		parseFloat(strMon[2])
	];
	var last=strMon.length-1;

	if(isNaN(strMon[0]))
	{
		res[0]=1;
		res[1]=strMon[0];
	}

	if(isNaN(strMon[last]))
	{
		res[1]=strMon[last];
		res[2]=1;
	}
	else
	{
		res[2]=parseFloat(strMon[last])
	}

	return res;
};
//Convierte una cadena preprocesada por clrStrPol en un array con monomios
function strPolArr(strPol)
{
	var splPol=strPol.split(/\+|\-/g);
	var polArr=[]
	
	for(var i=0;i<splPol.length;i++)
	{
		polArr[i]=splPol[i];
	}

	return polArr;
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
	
	for(var j=0;j<polArr.length;j++)
	{
		ordenado[j]=refPolCohef[cohefs[j]];
	};
	
	return ordenado;
};
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

	proc=clrStrPol(txt);
	proc=strPolArr(proc);

	pol=[];
	for(var j=0;j<proc.length;j++)
	{
		pol[j]=strMonArr(proc[j])
	}
	
	reordenaCohef(pol);

	return completaPolArr(pol);
}
function outinput()
{
	var pol=procesaPol(document.getElementsByName("pol")[0].value);
	var txt="Res : ";
	
	for(var j=0;j<pol.length;j++)
	{
		txt+=" ( ";
		for(var i=0;i<pol[j].length;i++)
		{
			txt+=pol[j][i];
		}
		txt+=" )";
	}

	document.getElementsByName("res")[0].innerHTML=txt;
}
function verifEstado(polArr){};