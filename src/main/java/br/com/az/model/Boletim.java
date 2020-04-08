package br.com.az.model;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Boletim {

	@Id
	@GeneratedValue
	private Long id;
	private Boolean status = true;

	private LocalDate dataBoletim;
	private Long novosCasos;
	private Long totalCasos;
	private Long novosObitos;
	private Long totalObitos;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Boolean getStatus() {
		return status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}

	public LocalDate getData() {
		return dataBoletim;
	}

	public void setData(LocalDate dataBoletim) {
		this.dataBoletim = dataBoletim;
	}

	public Long getNovosCasos() {
		return novosCasos;
	}

	public void setNovosCasos(Long novosCasos) {
		this.novosCasos = novosCasos;
	}

	public Long getTotalCasos() {
		return totalCasos;
	}

	public void setTotalCasos(Long totalCasos) {
		this.totalCasos = totalCasos;
	}

	public Long getNovosObitos() {
		return novosObitos;
	}

	public void setNovosObitos(Long novosObitos) {
		this.novosObitos = novosObitos;
	}

	public Long getTotalObitos() {
		return totalObitos;
	}

	public void setTotalObitos(Long totalObitos) {
		this.totalObitos = totalObitos;
	}

}
