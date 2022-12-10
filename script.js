// Elementos HTML obtenidos por medio del ID 
const tablero = document.getElementById('tablero');
const scoreTablero = document.getElementById('scoreTablero');
const botonInicio = document.getElementById('iniciar');
const juegoTerminado = document.getElementById('juegoTerminado');

// Ajustes del juego
const tamTablero = 10; //Constante que define el tamaño del tablero
const velocidadJuego = 100; //Contanstante que define la velocidad de la serpiente
const tiposCuadrados = { //Objeto con los tipos de cuadrados del juego
    cuadradoVacio: 0,
    cuadradoSnake: 1,
    cuadradoComida: 2
};

//Objeto que define los movimientos de la serpiente
const direcciones = {
    ArrowUp: -10, //Arriba
    ArrowDown: 10, //Abajo
    ArrowRight: 1, //Derecha
    ArrowLeft: -1, //Izquierda
};

// Variables del juego
let snake; //Variable que almacena a la serpiente
let score; //Variable que almacena el puntaje
let direccion; //Variable que almacena el movimiento realizado por la serpiente
let cuadradosDelTablero; //Variable que almacena todo el tablero
let cuadradosVacios; //Variable que almacena cuadrados vacios
let intervaloMovimiento; //Mivimiento de la serpiente

//Funcion para mostrar a la serpiente
const mostrarSnake = () => {
    snake.forEach( cuadrado => mostrarCuadrado(cuadrado, 'cuadradoSnake')); //Se colocan lo cuadrados de tipo cuadradoSnake en su lugar correspondiente
}

// Rellena cada cuadrado del tablero
// @params 
// square: posicion del cuadrado,
// type: tipo de cuadrado (cuadradoVacio, cuadradoSnake, cuadradoComida)
const mostrarCuadrado = (cuadrado, tipo) => {
    const [ row, column ] = cuadrado.split(''); //separar la fila y la columna del arreglo
    cuadradosDelTablero[row][column] = tiposCuadrados[tipo];
    const elementoCuadrado = document.getElementById(cuadrado);
    elementoCuadrado.setAttribute('class', `cuadrado ${tipo}`);

    if(tipo === 'cuadradoVacio') {
        cuadradosVacios.push(cuadrado); //Se agrega un cuadrado vacio al arreglo
    } else {
        if(cuadradosVacios.indexOf(cuadrado) !== -1) {
            cuadradosVacios.splice(cuadradosVacios.indexOf(cuadrado), 1); //Se quita el cuadrado vacio del arreglo
        }
    }
}

//Funcion que permite determinar el movimiento de l serpiente
const movimientoSnake = () => {
    const nuevoCuadrado = String(
        Number(snake[snake.length - 1]) + direcciones[direccion]) //Se suma o resta el valor de la variable direccion 
        .padStart(2, '0');
    const [row, column] = nuevoCuadrado.split('');

    //Condicional que permite determinar si el juego termino o si el la serpiente obtuvo comida
    if( nuevoCuadrado < 0 || 
        nuevoCuadrado > tamTablero * tamTablero  ||
        (direccion === 'ArrowRight' && column == 0) ||
        (direccion === 'ArrowLeft' && column == 9 ||
        cuadradosDelTablero[row][column] === tiposCuadrados.cuadradoSnake) ) {
        finDelJuego();
    } else {
        snake.push(nuevoCuadrado);
        if(cuadradosDelTablero[row][column] === tiposCuadrados.cuadradoComida) {
            agregarComida();
        } else {
            const cuadradoVacio = snake.shift();
            mostrarCuadrado(cuadradoVacio, 'cuadradoVacio');
        }
        mostrarSnake();
    }
}

//Funcion que permite agregar la comida a la serpiente
const agregarComida = () => {
    score++; // el puntaje aumenta
    actualizarScore(); //Se actualiza el score
    CrearComidaAleatoria(); //se crea nueva comida de forma aleatoria
}

//Funcion que permite terminar el juego
const finDelJuego = () => {
    juegoTerminado.style.display = 'block'; //se muestra el mensaje de game over
    clearInterval(intervaloMovimiento) //Se detiene el intervalo de movimiento
    botonInicio.disabled = false; //Se vuelve a habilitar el boton de start
}

//Funcion que reinicia el valor del variable direccion
const elegirDireccion = newDireccion => {
    direccion = newDireccion;
}

//Funcion que permite determinar la direccion de la serpiente
const movimiento = key => {
    //En cada case se evita que la serpiente vaya hacia la direccion contraria que se indico inicialmente
    switch (key.code) {
        case 'ArrowUp':
            direccion != 'ArrowDown' && elegirDireccion(key.code)
            break;
        case 'ArrowDown':
            direccion != 'ArrowUp' && elegirDireccion(key.code)
            break;
        case 'ArrowLeft':
            direccion != 'ArrowRight' && elegirDireccion(key.code)
            break;
        case 'ArrowRight':
            direccion != 'ArrowLeft' && elegirDireccion(key.code)
            break;
    }
}

//Funcion para crear comida
const CrearComidaAleatoria = () => {
    const cuadradoVacioAleatorio = cuadradosVacios[Math.floor(Math.random() * cuadradosVacios.length)]; //Se crea un lugar aleatorio entre todos los cuadrados vacios
    mostrarCuadrado(cuadradoVacioAleatorio, 'cuadradoComida'); //Se muestra en pantalla en cuadrado de tipo cuadradoComida
}

const actualizarScore = () => {
    scoreTablero.innerText = score; //Se muestra en puntaje en pantalla, segun el valor de la variable score
}

//Creación del tablero
const crearTablero = () => {
    //Iteracion para obtener cada arreglo 
    cuadradosDelTablero.forEach( (row, rowIndex) => {
        //Iteracion para obtener un elemento de cada arreglo
        row.forEach( (column, columnndex) => {
            //Se coloca un ID para cada elemento
            const valorCuadrado = `${rowIndex}${columnndex}`;
            const elementoCuadrado = document.createElement('div');
            elementoCuadrado.setAttribute('class', 'cuadrado cuadradoVacio');
            elementoCuadrado.setAttribute('id', valorCuadrado);
            tablero.appendChild(elementoCuadrado);
            cuadradosVacios.push(valorCuadrado);
        })
    })
}

//Se establecen los valores de las variables del juego 
const establecerJuego = () => {
    snake = ['00', '01', '02', '03']; //Creación de la serpiente
    score = snake.length; //puntaje que aumente con el segun el tamaño de la serpiete
    direccion = 'none'; //direccion de la serpiente
    cuadradosDelTablero = Array.from(Array(tamTablero), () => new Array(tamTablero).fill(tiposCuadrados.cuadradoVacio)); //Tablero del juego
    tablero.innerHTML = '';
    cuadradosVacios = []; //Arreglo de los cuadrados vacios
    crearTablero(); //Funcion que permite crear el tablero
}

//Funcion que permite iniciar el juego
const iniciarJuego = () => {
    establecerJuego();
    juegoTerminado.style.display = 'none'; //Ocultar el mensaje de game over
    botonInicio.disabled = true; //Bloqueo del boton de inicio del juego
    mostrarSnake();
    actualizarScore();
    CrearComidaAleatoria();
    document.addEventListener('keydown', movimiento); //Cuando se presiona un boton se llama a la funcion movimiento
    intervaloMovimiento = setInterval( () => movimientoSnake(), velocidadJuego);
}



botonInicio.addEventListener('click', iniciarJuego); //Funcion que permite iniciar el juego al dar click en el boton de start