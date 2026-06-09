# Convención de commits

Este proyecto usa [Conventional Commits](https://www.conventionalcommits.org/).

## Formato
<tipo>(scope opcional): descripción corta

## Tipos permitidos

| Tipo | Uso |
|---|---|
| `feat()` | Nueva funcionalidad |
| `fix()` | Corrección de bug |
| `chore` | Tareas de mantenimiento, configuración |
| `docs` | Cambios en documentación |
| `test()` | Agregar o modificar tests |
| `refactor` | Refactorización sin cambio funcional |
| `style` | Formato, espacios, puntos y comas |

## Ejemplos
feat(contracts): add CertificadorDocumentos.sol   
fix(backend): handle duplicate hash error from contract   
chore: add .gitignore for node_modules   
docs: update README with contract address   
test(contracts): add unit tests for verificar function   

## Reglas

- Descripción en inglés, en minúsculas, sin punto final
- Máximo 72 caracteres en la primera línea
- Un commit por archivo (atomic commits)
