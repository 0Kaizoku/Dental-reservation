using Dental_reservation.api.Data;
using Dental_reservation.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Dental_reservation.api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class InformationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InformationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("beneficiaire/{matricule}")]
        public async Task<ActionResult<BeneficiaireDto>> GetBeneficiaire(string matricule)
        {
            var personne = await _context.PopPersonnes
                .FirstOrDefaultAsync(p => p.NumSecuOdPer == matricule);

            if (personne == null)
            {
                return NotFound();
            }

            var adresse = await _context.PopAdressePs
                .FirstOrDefaultAsync(a => a.IdNumAdressePer == personne.IdNumAdressePer);

            var beneficiaireDto = new BeneficiaireDto
            {
                IdFamille = personne.IdNumFamillePer,
                Nom = $"{personne.NomPer} {personne.PrenomPer}",
                DateNaissance = personne.DateNaissancePer,
                Adresse = $"{adresse?.AuxiliaireAdresse1Per} {adresse?.AuxiliaireAdresse2Per} {adresse?.NomLieuDitPer}".Trim(),
                Matricule = personne.NumSecuOdPer,
                EtatBnf = personne.CodeStatutPer,
                Qualite = personne.CodeQualitePersonnePer,
                // NCIN and Ville are not in the database schema
            };

            return Ok(beneficiaireDto);
        }

        [HttpGet("assure/{matricule}")]
        public async Task<ActionResult<AssureDto>> GetAssure(string matricule)
        {
            var personne = await _context.PopPersonnes
                .FirstOrDefaultAsync(p => p.NumSecuOdPer == matricule);

            if (personne == null)
            {
                return NotFound();
            }

            var contrat = await _context.PopContratPersonnes
                .FirstOrDefaultAsync(c => c.IdNumPersonneCtt == personne.IdNumPersonne);

            var assureDto = new AssureDto
            {
                IdFamille = personne.IdNumFamillePer,
                Nom = $"{personne.NomPer} {personne.PrenomPer}",
                DateNaissance = personne.DateNaissancePer,
                CodeProduit = contrat?.CodeProduit,
                Matricule = personne.NumSecuOdPer,
                // NCIN and LibProduit are not in the database schema
            };

            return Ok(assureDto);
        }

        [HttpGet("collectivite/{codeCollectivite}")]
        public async Task<ActionResult<CollectiviteDto>> GetCollectivite(string codeCollectivite)
        {
            var collectivite = await _context.collectivites
                .FirstOrDefaultAsync(c => c.CodeCollectivite == codeCollectivite);

            if (collectivite == null)
            {
                return NotFound();
            }

            var collectiviteDto = new CollectiviteDto
            {
                CodeCollectivite = collectivite.CodeCollectivite,
                RaisonSociale = collectivite.RaisonSociale,
                Adresse = collectivite.Adresse,
                Ville = collectivite.Ville
            };

            return Ok(collectiviteDto);
        }
    }
} 