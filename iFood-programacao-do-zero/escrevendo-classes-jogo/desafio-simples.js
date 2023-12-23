class Heroi {
    constructor(nome, idade, tipo) {
      this.nome = nome;
      this.idade = idade;
      this.tipo = tipo;
    }
  
    // O Método
    atacar() {
      let ataque;
  
      // Tipo de ataque de cada heroi
      switch (this.tipo) {
        case "mago":
          ataque = "magia";
          break;
        case "guerreiro":
          ataque = "espada";
          break;
        case "monge":
          ataque = "artes marciais";
          break;
        case "ninja":
          ataque = "shuriken";
          break;
      }
  
      console.log(`O ${this.tipo} ${this.nome} atacou usando ${ataque}!!!`);
    }
  }
  
  // Criando instâncias
  const mago = new Heroi("Merlin", 200, "mago");
  const guerreiro = new Heroi("Alexandre, O grande", 18, "guerreiro");
  const monge = new Heroi("Bunda", 85, "monge");
  const ninja = new Heroi("Scorpion", 25, "ninja");
  
  // Chamando os métodos atacar
  mago.atacar();
  guerreiro.atacar();
  monge.atacar();
  ninja.atacar();  