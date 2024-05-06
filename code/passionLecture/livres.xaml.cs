using System;
using System.IO;
using Aspose.Pdf;
using Aspose;
using static System.Reflection.Metadata.BlobBuilder;
using System.Reflection;
using System.Net.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using VersOne.Epub;
namespace passionLecture;

public partial class livres : ContentPage
{
    HttpClient client = new();
    public livres()
	{
        InitializeComponent();
    
	}
    private async void GetBooks2(object sender, EventArgs e)
    {
        
        string apiUrl = "http://10.0.2.2:3000/api/books/2";
        try
        {
            
            EpubBook response = await client.GetAsync(apiUrl);

            response.EnsureSuccessStatusCode();
             
        }
        catch (Exception ex)
        {
           await DisplayAlert("erreur: ", ex.Message, "Nul");
            //return "Erreur : "+ ex.Message;
        }
    }

}

