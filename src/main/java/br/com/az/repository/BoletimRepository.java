package br.com.az.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.az.model.Boletim;

@Repository
public interface BoletimRepository extends JpaRepository<Boletim, Long> {

	List<Boletim> findAllByStatusTrue();

}
