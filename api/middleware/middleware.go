package middleware

import (
	"encoding/json"
	"net/http"
	"souin_middleware/pkg"
	"strings"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig/caddyfile"
	"github.com/caddyserver/caddy/v2/caddyconfig/httpcaddyfile"
	"github.com/caddyserver/caddy/v2/modules/caddyhttp"
	"go.uber.org/zap"
)

const moduleName = "souin_middleware_handler"

func init() {
	caddy.RegisterModule(Middleware{})
	httpcaddyfile.RegisterGlobalOption(moduleName, func(_ *caddyfile.Dispenser, _ any) (any, error) { return &Middleware{}, nil })
	httpcaddyfile.RegisterHandlerDirective(moduleName, func(_ httpcaddyfile.Helper) (caddyhttp.MiddlewareHandler, error) { return &Middleware{}, nil })
}

type Middleware struct {
	logger  *zap.Logger
	checker *pkg.CheckerChain
}

func (Middleware) CaddyModule() caddy.ModuleInfo {
	return caddy.ModuleInfo{
		ID:  "http.handlers.souin_middleware_handler",
		New: func() caddy.Module { return new(Middleware) },
	}
}

func isCandidateToAdd(path, method string, status int) bool {
	return (status == http.StatusOK || status == http.StatusCreated) &&
		(method == http.MethodPost && strings.Contains(path, "/domains") ||
			(method == http.MethodPost || method == http.MethodPatch) && strings.Contains(path, "/configurations"))
}

func isCandidateToDel(path, method string, status int) bool {
	return status == http.StatusNoContent && method == http.MethodDelete && strings.Contains(path, "/domains")
}

type apiPayload struct {
	Dns    string `json:"dns"`
	Id     string `json:"@id"`
	Zone   string `json:"zone"`
	Domain struct {
		Dns string `json:"dns"`
		Id  string `json:"@id"`
	} `json:"domain"`
}

func (s *Middleware) ServeHTTP(rw http.ResponseWriter, r *http.Request, next caddyhttp.Handler) error {
	method := r.Method
	path := r.URL.Path
	mrw := newWriter(rw)
	if err := next.ServeHTTP(mrw, r); err != nil {
		return err
	}

	if isCandidateToAdd(path, method, mrw.status) {
		var domain apiPayload
		if err := json.Unmarshal(mrw.body.Bytes(), &domain); err != nil {
			return nil
		}

		root := domain.Dns
		id := domain.Id
		sub := domain.Zone

		if root == "" {
			root = domain.Domain.Dns
			id = domain.Domain.Id
		}

		if root == "" {
			return nil
		}

		s.checker.Add(id, root, sub)

		return nil
	}

	if isCandidateToDel(path, method, mrw.status) {
		s.checker.Del(path)

		return nil
	}

	return nil
}

func (s *Middleware) Provision(ctx caddy.Context) error {
	s.logger = ctx.Logger(s)
	s.checker = pkg.NewCheckerChain(s.logger)
	domains := pkg.RetrieveDomains()

	for _, domain := range domains {
		for _, sub := range domain.Configurations {
			s.checker.Add(domain.Id, domain.Dns, sub.Zone)
		}
	}

	return nil
}

func (s *Middleware) UnmarshalCaddyfile(_ *caddyfile.Dispenser) error {
	return nil
}

var (
	_ caddy.Provisioner           = (*Middleware)(nil)
	_ caddyhttp.MiddlewareHandler = (*Middleware)(nil)
	_ caddyfile.Unmarshaler       = (*Middleware)(nil)
)
