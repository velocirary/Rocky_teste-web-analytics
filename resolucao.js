const fs = require('fs')

function readFile(fileName) {
    try {
        let data = fs.readFileSync(fileName, 'utf-8')
        return JSON.parse(data)
    } catch (err) {
        console.error(err)
    }
}


function fixNames(data){
    return data.map((el) => {
        const fixedName = el.name.replaceAll("æ", "a").replaceAll("ø", "o").replaceAll("¢", "c").replaceAll("ß", "b")
        return {
            ...el,
            name: fixedName
        }
    })
}

function fixPrice(data){
    return data.map((el) => {
        return {
            ...el,
            price: Number(el.price)
        }
    })
}

function fixQuantity(data){
    return data.map((el) =>{
        if (el.quantity == undefined){
            return{
                ...el,
                quantity: 0
            }
        }
        else{
            return el
        }
    })
}

function saveFile(fixedContent, destiny){
    fs.writeFile(destiny, fixedContent, (error) =>{
        if (error){
            console.error(error)
            return
        }
    })

}

function orderItems(data){
    const sortedByID = data.sort((a, b) =>{
        return a.id - b.id
    }) 
    return sortedByID.sort((a, b) => {
        if (a.category > b.category){
            return 1
        }
        if(a.id > a.id){
            return -1
        }
        return 0
    })
}

const categories = ['Panelas', 'Eletrodomésticos', 'Eletrônicos', 'Acessórios']

function sumTotalItems(items) {
    return categories.map((category) => {
      return {
        category,
        total: items.reduce((acc, current) => {
          if (current.category === category) {
            if (!current.quantity) {
              return acc + current.price
            }
            return acc + (current.price * current.quantity)
          }
          return acc
        }, 0)
      } 
    })
  }


const meuarquivo = readFile('/Users/raryo/rocky-challenge/broken-database.json')

console.log(Array.isArray(meuarquivo)) //verificar se é um array
console.log(fixNames(fixQuantity(fixPrice(meuarquivo)))) //funções para o save do json
console.log(sumTotalItems(orderItems(fixNames(fixQuantity(fixPrice(meuarquivo)))))) 
//executa as funções de soma e ordenação juntamente com os critéritos solicitados

const fixedFile = fixNames(meuarquivo)
saveFile(JSON.stringify(fixedFile), '/Users/raryo/rocky-challenge/correct-database.json')


