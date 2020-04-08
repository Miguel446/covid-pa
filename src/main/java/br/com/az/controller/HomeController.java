package br.com.az.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

	@RequestMapping(path = "/")
	public String home(Model model) {
		// model.addAttribute("totalEmpresa", empresaService.contar());
		return "index";
	}

}
