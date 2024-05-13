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
using System.IO.Compression;
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
        
        string apiUrl = "http://10.0.2.2:3000/api/books/title";
        try
        {
            var response = await client.GetAsync(apiUrl);
            if (response.IsSuccessStatusCode)
            {
                try
                {
                    var content = response.Content;
                    //EpubBook book = EpubReader.ReadBook(content.ReadAsStream());
                    allBooksLabel.Text = content.ToString();
                }
                catch (Exception ex)
                {
                    allBooksLabel.Text += ex.Message;
                }
            }
        }
        catch(Exception ex)
        {
            allBooksLabel.Text = ex.Message;
        }
        
        
    }

}

