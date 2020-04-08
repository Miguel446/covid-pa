package br.com.az.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.az.model.Boletim;
import br.com.az.repository.BoletimRepository;

@Service
public class BoletimService {

	@Autowired
	private BoletimRepository boletimRepository;

	public List<Boletim> listarTodos() {
		return boletimRepository.findAllByStatusTrue();
	}

}
