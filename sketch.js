
let grid = []
let sizeX
let sizeY
let maxAge = 256

let vkdPeriod = 300
let lastVKDframeCount = vkdPeriod
let frameCount = 0;

let direction = false
let string = "###-##-###"
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
			grid[i][j] = 
			{ 
				letter: null, 
				age: 0, 
				class: null, 
				q_age : 0 
			}
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
			class: "source",
			q_age: 0
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

function draw() {

	frameCount++
	
	clear()
	background(255)

	if (lastVKDframeCount + vkdPeriod < frameCount)
	{
		random_vkd()
	}
				
	for (let i = 0; i < sizeX; i++) 
	{
		for (let j = 0; j < sizeY; j++) 
		{

			let point = grid[i][j]

			if (point.age < 15)
			{
				point.age = 0
				point.q_age = 0
			}

			if (point.class === "source")
			{
				// if (frameCount % 30 === 0)
				// {
				point.age *= 0.9

				if (random(100) > 90)
				{
					point.age *= 0.9
				}
				// }

				if (point.age < maxAge * 0.5){
					point.age *= 0.9
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

			else if (point.age > 0)
			{
				//if (frameCount % 5 === 0)
				// {
				point.age *= 0.95
				// }
			
				let chars = [ "░",  "▒", "▓",  "█" ]
				let index = min(point.age / maxAge * chars.length | 0, chars.length - 1)
				point.output = chars[index]

				
			}
			let c = color(0)
			// c.setAlpha(min(point.age, 255))
			fill(c)
			
			text(point.output || "", i * dX, j * dY)

			
			
			// if (point.class !== "source") 
			// {				
				
			// 	//let food = calculateFood(i, j);
			// 	// console.log(food)

			// 	// if (random(1000) < 999 - food / 30) 
			// 	// {
			// 	// 	//continue;
			// 	// }

			// 	if (food > 0 ) {
			// 		point.letter = "█"	
			// 		point.class = "food"
			// 		point.color = color(150, 100, 100)

			// 		{
			// 			point.age = min(maxAge, (point.age * 2 + food)/  3 )
			// 		}

					
				
			// 	}
			//}

		
			
		}
		
	}

	for (let i = 0; i < sizeX; i++) 
	{
		for (let j = 0; j < sizeY; j++) 
		{
			let point = grid[i][j]
			// if (point.age !== 0)
			{
				for (let a of [-1, 1 ])
				{
					if (i + a >= 0 && i + a < sizeX)
					{
						grid[i + a][j].q_age += 0.15 * point.age
					}
										
					if (j + a >= 0 && j + a < sizeY)
					{
						grid[i][j + a].q_age += 0.15 * point.age
					}
					
					point.age *= 0.8
				}
			}
			
		}
	}

	for (let i = 0; i < sizeX; i++) 
	{
		for (let j = 0; j < sizeY; j++) 
		{
			let point = grid[i][j]
			point.age += point.q_age 
			point.q_age = 0
		}
	}



	// fill("red")
	// text(frameCount, 100, 0)
}
