import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiService, PatientDossier as PatientDossierType } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, Phone, Mail, ArrowLeft, Printer } from "lucide-react";

const PatientDossier = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patientId = Number(id);

  const { data, isLoading, error } = useQuery<PatientDossierType>({
    queryKey: ["patient-dossier", patientId],
    queryFn: () => apiService.getPatientDossier(patientId),
    enabled: !isNaN(patientId),
  });

  const patient = data?.patient;
  const appointments = data?.appointments || [];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50 to-white">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-4xl font-extrabold text-purple-800">Consultation du Dossier</h1>
          <p className="text-gray-600">Dossier du patient</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Imprimer PDF
          </Button>
        </div>
      </div>

      {isLoading && (
        <Card className="border-0 shadow-soft"><CardContent className="p-6">Chargement...</CardContent></Card>
      )}
      {error && (
        <Card className="border-0 shadow-soft"><CardContent className="p-6 text-destructive">Erreur de chargement</CardContent></Card>
      )}
      {!isLoading && !error && patient && (
        <>
          <Card className="border-0 shadow-soft print:shadow-none print:border print:border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-dental-blue">{patient.name}</span>
                <Badge variant="outline">{patient.gender}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Date de naissance</div>
                <div className="font-medium">{patient.dateOfBirth || "-"}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Dernière visite</div>
                <div className="font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {patient.lastVisit || "-"}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Prochain RDV</div>
                <div className="font-medium">{patient.nextAppointment || "-"}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Contact</div>
                <div className="font-medium flex items-center gap-4">
                  <span className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {patient.phone || "-"}</span>
                  <span className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {patient.email || "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft print:shadow-none print:border print:border-gray-200">
            <CardHeader>
              <CardTitle>Historique des rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Heure</TableHead>
                      <TableHead>Docteur</TableHead>
                      <TableHead>Nature du soin</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.length === 0 && (
                      <TableRow><TableCell colSpan={5}>Aucun rendez-vous trouvé</TableCell></TableRow>
                    )}
                    {appointments.map((a) => (
                      <TableRow key={a.numRdv}>
                        <TableCell>{a.dateRdv ? new Date(a.dateRdv).toLocaleDateString() : "-"}</TableCell>
                        <TableCell>{a.heure || "-"}</TableCell>
                        <TableCell>{a.nomPs || "-"}</TableCell>
                        <TableCell>{a.natureSoin || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {a.status || "-"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PatientDossier;
