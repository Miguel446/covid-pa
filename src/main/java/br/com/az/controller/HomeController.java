package br.com.az.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import br.com.az.model.Boletim;
import br.com.az.service.BoletimService;

@Controller
public class HomeController {

	@Autowired
	private BoletimService boletimService;

	@RequestMapping(path = "/")
	public String home() {
		return "index";
	}

	@GetMapping("/boletim")
	@ResponseBody
	public List<Boletim> listar() {
		return boletimService.listarTodos();
	}

}
