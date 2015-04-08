var pg = require('pg');
var conString = "postgres://banav:j4rv1s@localhost/banav";
var conString = "postgres://banav:j4rv1s@173.230.137.47/banav";


var express = require('express');
var restapi = express();
//var cliente;
//var donee;

	pg.connect(conString, function(err, client, done) {

	  cliente = client;
	  donee = done;
	});


restapi.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
  next();
});


restapi.get('/navio', function(req, res){
	pg.connect(conString, function(err, client, done){
		client.query('SELECT * from navio n',  function(err, result) {
			done();
			res.json(result.rows);
		});
	});	
});

restapi.get('/classe', function(req, res){
	pg.connect(conString, function(err, client, done){
		client.query('SELECT * from classe n',  function(err, result) {
			done();
			res.json(result.rows);
		});
	});	
});

restapi.get('/porto', function(req, res){
	pg.connect(conString, function(err, client, done){
		client.query('SELECT * from porto n',  function(err, result) {
			done();
			res.json(result.rows);
		});
	});	
});

restapi.get('/navio_classe', function(req, res){
	var sql = 'SELECT n.nome navio, c.nome classe, nc.quantidade quantidade '+ 
	'from navio_classe nc, classe c, navio n '+ 
	'where n.id = nc.navio and c.id = nc.classe '+ 
	'order by n.nome' 
	pg.connect(conString, function(err, client, done){
		client.query(sql,  function(err, result) {
			done();
			res.json(result.rows);
		});
	});	
});

restapi.get('/relatorio', function(req, res){
	var sql = 'select c.nome, sum(p.valor) '+ 
		'from public.viagem v, public.viagem_valor_classe vvc, public.passagem p, public.classe c '+ 
		'where to_char(v.horasaida,\'YYYY-MM-DD\') = \'2015-03-24\' '+  
		'and vvc.viagem_id = v.id '+ 
		'and p.viagem_valor_classe_id = vvc.id '+ 
		'and c.id = vvc.classe '+ 
		'and not exists (select 1 from public.passagem_historico ph where ph.passagemmovimento = \'CANCELADA\' and ph.passagem_id = p.id) '+ 
		'group by c.nome '+ 
		'union All '+ 
		'select  \'Total\' AS name, sum(p.valor) '+ 
		'from public.viagem v, public.viagem_valor_classe vvc, public.passagem p, public.classe c '+ 
		'where to_char(v.horasaida,\'YYYY-MM-DD\') = \'2015-03-24\' '+ 
		'and vvc.viagem_id = v.id '+ 
		'and p.viagem_valor_classe_id = vvc.id '+ 
		'and c.id = vvc.classe '+ 
		'and not exists (select 1 from public.passagem_historico ph where ph.passagemmovimento = \'CANCELADA\' and ph.passagem_id = p.id)'

	pg.connect(conString, function(err, client, done){
		client.query(sql,  function(err, result) {
			done();
			res.json(result.rows);
		});
	});	
});

restapi.get('/relatorio/:data', function(req,res){
	var sql = 'select c.nome, sum(p.valor) '+ 
		'from public.viagem v, public.viagem_valor_classe vvc, public.passagem p, public.classe c '+ 
		'where to_char(v.horasaida,\'YYYY-MM-DD\') = $1 '+  
		'and vvc.viagem_id = v.id '+ 
		'and p.viagem_valor_classe_id = vvc.id '+ 
		'and c.id = vvc.classe '+ 
		'and not exists (select 1 from public.passagem_historico ph where ph.passagemmovimento = \'CANCELADA\' and ph.passagem_id = p.id) '+ 
		'group by c.nome '+ 
		'union All '+ 
		'select  \'Total\' AS name, sum(p.valor) '+ 
		'from public.viagem v, public.viagem_valor_classe vvc, public.passagem p, public.classe c '+ 
		'where to_char(v.horasaida,\'YYYY-MM-DD\') =  $1'+ 
		'and vvc.viagem_id = v.id '+ 
		'and p.viagem_valor_classe_id = vvc.id '+ 
		'and c.id = vvc.classe '+ 
		'and not exists (select 1 from public.passagem_historico ph where ph.passagemmovimento = \'CANCELADA\' and ph.passagem_id = p.id)'
	
	pg.connect(conString, function(err, client, done){
		client.query(sql, [req.params.data],  function(err, result) {
			done();
			res.json(result.rows);
		});
	});	
});

restapi.get('/relatoriomensal/:data', function(req,res){
	var sql = 'select c.nome, sum(p.valor) '+ 
		'from public.viagem v, public.viagem_valor_classe vvc, public.passagem p, public.classe c '+ 
		'where to_char(v.horasaida,\'YYYY-MM\') = $1 '+  
		'and vvc.viagem_id = v.id '+ 
		'and p.viagem_valor_classe_id = vvc.id '+ 
		'and c.id = vvc.classe '+ 
		'and not exists (select 1 from public.passagem_historico ph where ph.passagemmovimento = \'CANCELADA\' and ph.passagem_id = p.id) '+ 
		'group by c.nome '+ 
		'union All '+ 
		'select  \'Total\' AS name, sum(p.valor) '+ 
		'from public.viagem v, public.viagem_valor_classe vvc, public.passagem p, public.classe c '+ 
		'where to_char(v.horasaida,\'YYYY-MM\') =  $1'+ 
		'and vvc.viagem_id = v.id '+ 
		'and p.viagem_valor_classe_id = vvc.id '+ 
		'and c.id = vvc.classe '+ 
		'and not exists (select 1 from public.passagem_historico ph where ph.passagemmovimento = \'CANCELADA\' and ph.passagem_id = p.id)'
	
	pg.connect(conString, function(err, client, done){
		client.query(sql, [req.params.data],  function(err, result) {
			done();
			res.json(result.rows);
		});
	});	
});

restapi.listen(3000);
