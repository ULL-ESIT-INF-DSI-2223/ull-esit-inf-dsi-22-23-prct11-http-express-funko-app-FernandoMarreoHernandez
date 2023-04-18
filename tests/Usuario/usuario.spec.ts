import 'mocha';
import { expect } from 'chai';
import { Usuario } from '../../dist/Usuario/Usuario.js';

describe('Usuario', () => {
    let Usuario1 = new Usuario('Fernando');
    it('se crea un Usuario', () => {
        expect(Usuario1).to.be.an.instanceOf(Usuario);
    }
    );
    it('se prueban los getters del usuario', () => {
        expect(Usuario1.GetNombre()).to.be.equal('Fernando');
    }
    );
});
