// {
//     id: "23125135",
//     nombre: "Juan",
//     sala: "Videojuegos"
// }

//la clase Ususarios se va a encargar de todos los users conecctados.
class Usuarios {

    constructor(){
        this.personas = [] /*Personas que están conectadas al chat*/
        }
        /*para agregar persona al chat. El id me lo regresa el socket, nombre de la persona.*/
        agregarPersona(id, nombre, sala){
            let persona = { id, nombre, sala} //creo a la persona

            this.personas.push(persona)

            return this.personas 
        } 

        getPersona(id){
            let persona = this.personas.filter( persona => {return persona.id === id
            })[0] /*[0] para indicar que devuelva el primer resultado*/
            
            return persona;
        }

        getPersonas(){
            return this.personas;
        }

        getPersonasPorSala( sala ){
            let personasPorSala = this.personas.filter( persona => persona.sala === sala)
            return personasPorSala;
        }

        //cuando un user se desconecta del chat, quiero borrarlo de las personas activas
        borrarPersona(id){

            let personaBorrada = this.getPersona(id)

            this.personas = this.personas.filter(personas => personas.id != id)

            return personaBorrada;
        }
    

}

module.exports = { Usuarios }