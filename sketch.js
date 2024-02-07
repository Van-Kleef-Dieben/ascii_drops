
let grid = []
let sizeX
let sizeY
let maxAge = 256

let vkdPeriod = 300
let lastVKDframeCount = vkdPeriod
let frameCount = 0;

let direction = false
let string = "VAN KLEEF-DIEBEN"
let font = "iA Writer Mono"

const dX = 15
const dY = 23

function setup() {

	let w = displayWidth
	let h = 400

	createCanvas(w, h);
	textFont(font)
	textStyle("bold")
	textSize(20)
	textAlign(CENTER, TOP)

	sizeX = (w / dX) | 0
	sizeY = (h / dY) | 0

	for (let i = 0; i < sizeX; i++) 
	{
		grid[i] = []
		for (let j = 0; j < sizeY; j++) 
		{
			grid[i][j] = { letter: null, age: 0, class: null }
		}
	}

	vkd((sizeX / 2 - string.length / 2)| 0, sizeY / 2 | 0 )
}

function vkd(x, y)
{
	let s = string
	let v 
	let max
	
	direction = !direction

	if (direction)
	{
		v = x
		max = sizeX
	}
	else
	{
		v = y
		max = sizeY
	}

	for (let i = 0; i < s.length; i++) {

		if (v + i >= max)
		{
			continue
		}

		let point = { 
			letter: s[i], 
			age: maxAge * 1.2, 
			color: color("black"), 
			class: "source" 
		}

		if (direction)
		{
			grid[x + i][y] = point
		
		}
		else
		{
			grid[x][y + i] = point
		}

		
	}
}

function random_vkd() 
{
	lastVKDframeCount = frameCount

	let x
	let y

	let found = false

	while(!found)
	{
		x = random(sizeX) | 0
		y = random(sizeY - 4) | 0  + 2

		if (y > (sizeY - string.length / 2))
		{
			continue
		}

		// found = getNeighbors(x, y, 5).length > 2
		found = true
	}

	vkd(x, y)

}

function getNeighbors(x, y, r)
{
	let neighbors = []
	for (let i = - r ; i < r; i++) 
	{
		for (let j = - r ; j < r + 1; j++) 
		{
			if (x + i < 0 || x + i >= sizeX || y + j < 0 || y + j >= sizeY)
			{
				continue;
			}

			if ((i * i) + (j * j) > r * r)
			{
				continue
			}

			let point = grid[x + i][y + j]

			if (point.letter !== null)
			{
				// if (point.class === "source" && point.age > maxAge * 0.8)
				// {
				// 	continue;
				// }
				
				neighbors.push(point)
			}
		} 
	}

	return neighbors;
}

function calculateFood(x, y)
{
	let neighbors = getNeighbors(x, y, 3);

	if (neighbors.length === 0)
	{
		return 0
	}

	let food = neighbors.reduce((total, neighbor) => { 
		if (neighbor.class === "source")
		{
			return total + ((neighbor.age > maxAge) * 0.9 ? 0 : (neighbor.age / 0.9))
		}
		return total + neighbor.age //(neighbor.class === "source" ? maxAge : neighbor.age)
	}, 0)

	return food / neighbors.length
}



function draw() {

	frameCount++
	
	clear()

	if (lastVKDframeCount + vkdPeriod < frameCount)
	{
		random_vkd()
	}


				
	for (let i = 0; i < sizeX; i++) 
	{
		for (let j = 0; j < sizeY; j++) 
		{

			let point = grid[i][j]

			// if (frameCount % 30 === 0)
			// {
			//point.age--
			// }
			

			if (point.age < 10)
			{
				point.letter = null
				point.class = null
				point.age = 0
			}

			if (point.class === "source")
			{
				// if (frameCount % 30 === 0)
				// {
				point.age *= 0.9995 

				if (random(100) > 90)
				{
					point.age *= 0.99
				}
				// }

				if (point.age < maxAge * 0.5){
					point.age *= 0.95
				}
				

				if (point.age >= maxAge || point.age < maxAge * 0.5)
				{
					chars =[ ":", ".", ""]
					
					if (random() * 20 > 15) 
					{
						point.output = chars[random() * chars.length | 0]
					}					
				}
				else 
				{
					point.output = point.letter
				}

				
			}

			if (point.class === "food")
			{
				//if (frameCount % 5 === 0)
				{
					point.age *= 0.9999
				}


			

				let chars = [ "░",  "▒", "▓",  "█" ]
				let index = min(point.age / maxAge * chars.length | 0, chars.length - 1)
				point.output = chars[index]

				
			}
			let c = point.color || color(255)
			c.setAlpha(min(point.age, 255))
			fill(c)
			
			text(point.output || "", i * dX, j * dY)
			
			if (point.class !== "source") 
			{				
				
				let food = calculateFood(i, j);
				// console.log(food)

				// if (random(1000) < 999 - food / 30) 
				// {
				// 	//continue;
				// }

				if (food > 0 ) {
					point.letter = "█"	
					point.class = "food"
					point.color = color(100, 100, 100)

					{
						point.age = min(maxAge, (point.age * 2 + food)/  3 )
					}

					
				
				}
			//}

		}
			
		}
		
	}



	// fill("red")
	// text(frameCount, 100, 0)
}
