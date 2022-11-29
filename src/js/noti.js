export class noti {

	notiError(mensaje){
		iziToast.show({
			title:mensaje,
			timeout: 5000,
			color:'red',
			position:'topRight',
			icon:"fa-solid fa-xmark",
		});
	}

	notiInfo(mensaje){
		iziToast.show({
			message: mensaje,
			timeout: 5000,
			position:'topRight',
			// Indigo-800 de Tailwind
			color: '#a5b4fc',
			icon: 'fa-solid fa-info',
		});
	}
};
